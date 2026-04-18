"""
NPIG Authentication Service
JWT-based auth with Role-Based Access Control (RBAC)
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta
from typing import Optional, List
import jwt
import bcrypt
import uuid
import os
from motor.motor_asyncio import AsyncIOMotorClient
import redis.asyncio as redis
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="NPIG Auth Service",
    description="National Predictive Intelligence Grid - Authentication & Authorization",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Config ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "npig-super-secret-key-2024")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60
REFRESH_TOKEN_EXPIRE_DAYS = 7

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

security = HTTPBearer()

# --- Role Definitions ---
ROLES = {
    "ADMIN": ["read", "write", "delete", "manage_users", "view_classified"],
    "ANALYST": ["read", "write", "view_classified"],
    "OPERATOR": ["read", "write"],
    "VIEWER": ["read"],
    "FIELD_AGENT": ["read", "create_alert"],
    "AI_SERVICE": ["read", "write", "internal"],
}

# --- Models ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: str = "VIEWER"
    department: Optional[str] = None
    clearance_level: int = 1  # 1-5 clearance levels

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: dict

class RefreshRequest(BaseModel):
    refresh_token: str

class PermissionCheck(BaseModel):
    user_id: str
    permission: str
    resource: Optional[str] = None

# --- DB Connection ---
mongo_client = None
redis_client = None

@app.on_event("startup")
async def startup():
    global mongo_client, redis_client
    try:
        mongo_client = AsyncIOMotorClient(MONGO_URL)
        redis_client = redis.from_url(REDIS_URL, decode_responses=True)
        logger.info("✅ Auth Service: DB connections established")
    except Exception as e:
        logger.error(f"❌ DB connection failed: {e}")

@app.on_event("shutdown")
async def shutdown():
    if mongo_client:
        mongo_client.close()
    if redis_client:
        await redis_client.close()

# --- Helpers ---
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire, "iat": datetime.utcnow(), "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    data = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
        "iat": datetime.utcnow(),
        "type": "refresh",
        "jti": str(uuid.uuid4())
    }
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = decode_token(credentials.credentials)
    if payload.get("type") != "access":
        raise HTTPException(status_code=401, detail="Invalid token type")
    
    # Check if token is blacklisted
    if redis_client:
        is_blacklisted = await redis_client.get(f"blacklist:{credentials.credentials}")
        if is_blacklisted:
            raise HTTPException(status_code=401, detail="Token has been revoked")
    
    db = mongo_client["npig_auth"]
    user = await db.users.find_one({"_id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    return user

# --- Endpoints ---
@app.post("/auth/register", response_model=dict, status_code=201)
async def register(user_data: UserCreate):
    db = mongo_client["npig_auth"]
    
    if await db.users.find_one({"email": user_data.email}):
        raise HTTPException(status_code=409, detail="Email already registered")
    
    if user_data.role not in ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of: {list(ROLES.keys())}")
    
    user_id = str(uuid.uuid4())
    user_doc = {
        "_id": user_id,
        "email": user_data.email,
        "password_hash": hash_password(user_data.password),
        "full_name": user_data.full_name,
        "role": user_data.role,
        "permissions": ROLES[user_data.role],
        "department": user_data.department,
        "clearance_level": user_data.clearance_level,
        "is_active": True,
        "created_at": datetime.utcnow().isoformat(),
        "last_login": None,
        "mfa_enabled": False,
    }
    
    await db.users.insert_one(user_doc)
    logger.info(f"New user registered: {user_data.email} [{user_data.role}]")
    
    return {
        "success": True,
        "user_id": user_id,
        "message": "User registered successfully",
        "role": user_data.role,
        "permissions": ROLES[user_data.role]
    }

@app.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    db = mongo_client["npig_auth"]
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not user.get("is_active"):
        raise HTTPException(status_code=403, detail="Account is deactivated")
    
    token_data = {
        "sub": user["_id"],
        "email": user["email"],
        "role": user["role"],
        "permissions": user["permissions"],
        "clearance_level": user.get("clearance_level", 1),
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(user["_id"])
    
    # Update last login
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": {"last_login": datetime.utcnow().isoformat()}}
    )
    
    # Store refresh token in Redis
    if redis_client:
        await redis_client.setex(
            f"refresh:{user['_id']}",
            REFRESH_TOKEN_EXPIRE_DAYS * 86400,
            refresh_token
        )
    
    logger.info(f"User logged in: {credentials.email}")
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user={
            "id": user["_id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "role": user["role"],
            "permissions": user["permissions"],
            "clearance_level": user.get("clearance_level", 1),
        }
    )

@app.post("/auth/refresh", response_model=dict)
async def refresh_token(request: RefreshRequest):
    payload = decode_token(request.refresh_token)
    if payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")
    
    db = mongo_client["npig_auth"]
    user = await db.users.find_one({"_id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    token_data = {
        "sub": user["_id"],
        "email": user["email"],
        "role": user["role"],
        "permissions": user["permissions"],
        "clearance_level": user.get("clearance_level", 1),
    }
    
    new_access_token = create_access_token(token_data)
    return {"access_token": new_access_token, "token_type": "bearer"}

@app.post("/auth/logout")
async def logout(credentials: HTTPAuthorizationCredentials = Depends(security), user=Depends(get_current_user)):
    # Blacklist the token
    if redis_client:
        payload = decode_token(credentials.credentials)
        ttl = int((datetime.fromtimestamp(payload["exp"]) - datetime.utcnow()).total_seconds())
        if ttl > 0:
            await redis_client.setex(f"blacklist:{credentials.credentials}", ttl, "1")
        # Remove refresh token
        await redis_client.delete(f"refresh:{user['_id']}")
    
    return {"success": True, "message": "Logged out successfully"}

@app.post("/auth/verify-permission")
async def verify_permission(check: PermissionCheck):
    """Internal endpoint for other services to verify permissions"""
    db = mongo_client["npig_auth"]
    user = await db.users.find_one({"_id": check.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    has_permission = check.permission in user.get("permissions", [])
    return {
        "user_id": check.user_id,
        "permission": check.permission,
        "granted": has_permission,
        "role": user["role"],
        "clearance_level": user.get("clearance_level", 1)
    }

@app.get("/auth/me")
async def get_profile(user=Depends(get_current_user)):
    user.pop("password_hash", None)
    user.pop("_id", None)
    return user

@app.get("/auth/health")
async def health():
    return {"status": "healthy", "service": "auth-service", "version": "1.0.0"}
