# NPIG Architecture Documentation

## Overview
This document outlines the folder structure, architecture decisions, and technical patterns used in the NPIG (National Predictive Intelligence Grid) application.

## Project Structure

```
NPIG/
├── frontend/                    # React frontend application
│   ├── public/                 # Static assets
│   │   └── npig-logo.png      # Application logo
│   ├── src/                    # Source code
│   │   ├── components/         # Reusable components
│   │   │   ├── Dashboard/      # Dashboard-specific components
│   │   │   │   └── AppShell.jsx # Main authenticated layout
│   │   │   ├── Footer/         # Footer components
│   │   │   │   ├── RedesignedFooter.jsx
│   │   │   │   ├── GlobeHero.jsx
│   │   │   │   ├── NexusCoreWave.jsx
│   │   │   │   └── PremiumBadge.jsx
│   │   │   └── Nexus/          # AI assistant components
│   │   │       └── NexusChatbot.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ReportsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── AdminPage.jsx
│   │   ├── store/              # State management
│   │   │   └── useStore.js     # Zustand global store
│   │   ├── utils/              # Utility functions
│   │   │   └── api.js          # API client
│   │   ├── App.jsx             # Main app component
│   │   └── index.css           # Global styles
│   ├── index.html              # HTML template
│   ├── package.json            # Dependencies
│   ├── tailwind.config.js      # Tailwind configuration
│   └── vite.config.js          # Vite configuration
├── COMPONENT_HIERARCHY.md      # Component documentation
└── ARCHITECTURE.md             # This file
```

## Architecture Decisions

### 1. State Management
**Decision:** Use Zustand for global state management

**Rationale:**
- Lightweight and simple API
- No provider wrapping required
- Excellent TypeScript support (planned)
- Built-in DevTools
- Minimal boilerplate

**Implementation:**
```javascript
// store/useStore.js
import { create } from 'zustand'

export const useStore = create((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  theme: 'dark',
  // ... actions
}))
```

---

### 2. Routing
**Decision:** Use React Router v6 for client-side routing

**Rationale:**
- Industry standard for React routing
- Excellent documentation and community
- Built-in route protection patterns
- Support for nested routes and layouts

**Implementation:**
```javascript
// App.jsx
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route element={<AppShell />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/reports" element={<ReportsPage />} />
  </Route>
</Routes>
```

---

### 3. Styling
**Decision:** Use Tailwind CSS with custom design system

**Rationale:**
- Utility-first approach for rapid development
- Consistent design system across components
- Excellent dark mode support
- Small bundle size with tree-shaking
- Easy customization via config

**Custom Design System:**
- Color palette: Dark mode optimized (#030712, #0F172A, #1E293B)
- Accent colors: Blue (#3B82F6), Violet (#8B5CF6), Cyan (#06B6D4)
- Typography: SF Pro Display (headings), Inter (body), JetBrains Mono (code)
- 12-column responsive grid system

---

### 4. Animation
**Decision:** Use Framer Motion for component animations

**Rationale:**
- Declarative API for complex animations
- Excellent performance with GPU acceleration
- Built-in gesture support (drag, tap, hover)
- Spring physics for natural motion
- Easy to implement scroll-triggered animations

**Animation Patterns:**
```javascript
// Entrance animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
>

// Hover effect
whileHover={{ scale: 1.05, y: -2 }}
whileTap={{ scale: 0.95 }}
```

---

### 5. 3D Graphics
**Decision:** Use Three.js with React Three Fiber

**Rationale:**
- Industry standard for WebGL
- React-friendly API via R3F
- Excellent performance with optimizations
- Rich ecosystem of helpers (drei)
- Support for complex 3D scenes

**Implementation:**
```javascript
// 3D Globe with data nodes
<Canvas>
  <HeroScene />
  <Stars />
  <Float>
    {nodes.map(node => <mesh key={node.id} position={node.position} />)}
  </Float>
</Canvas>
```

---

### 6. Data Visualization
**Decision:** Use Recharts for charts and graphs

**Rationale:**
- React-native component library
- Excellent documentation
- Responsive by default
- Customizable styling
- Good performance for moderate datasets

---

### 7. Form Handling
**Decision:** Controlled components with local state

**Rationale:**
- Simple and predictable
- Easy validation
- No additional dependencies needed
- Works well with existing patterns

---

### 8. Authentication
**Decision:** JWT-based authentication with demo fallback

**Rationale:**
- Stateless and scalable
- Industry standard
- Easy integration with backend
- Demo mode for development

**Flow:**
1. User enters credentials
2. API call to authenticate
3. JWT token stored in Zustand
4. Protected routes check token
5. Biometric/MFA verification (optional)

---

### 9. Theme System
**Decision:** Class-based theme switching with CSS overrides

**Rationale:**
- Simple implementation
- No runtime CSS-in-JS overhead
- Easy to maintain
- Works with Tailwind's dark mode
- Comprehensive light mode overrides

**Implementation:**
```javascript
// Toggle theme
toggleTheme: () => {
  const next = get().theme === 'dark' ? 'light' : 'dark'
  set({ theme: next })
  document.documentElement.classList.toggle('light', next === 'light')
  document.documentElement.classList.toggle('dark', next === 'dark')
}
```

---

### 10. Component Organization
**Decision:** Feature-based folder structure

**Rationale:**
- Easy to locate related components
- Scalable as application grows
- Clear separation of concerns
- Supports code splitting

**Pattern:**
```
src/
├── components/     # Shared/reusable components
│   ├── Dashboard/  # Dashboard-specific
│   ├── Footer/     # Footer-specific
│   └── Nexus/      # AI assistant
└── pages/          # Route components
```

---

## Design Patterns

### 1. Glassmorphism
**Pattern:** Translucent backgrounds with blur effects

**Implementation:**
```javascript
style={{
  background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(3,7,18,0.95) 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
}}
```

**Usage:** Cards, modals, overlays, navigation

---

### 2. Ambient Glow
**Pattern:** Multi-layer radial gradients for depth

**Implementation:**
```javascript
<div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl"
  style={{ background: 'rgba(59,130,246,0.15)' }} />
```

**Usage:** Card accents, buttons, hero sections

---

### 3. Gradient Accents
**Pattern:** Gradient borders and text

**Implementation:**
```javascript
// Gradient text
className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400"

// Gradient border
className="border-t-2 bg-gradient-to-r from-violet-500/60 via-blue-500/60 to-cyan-500/60"
```

---

### 4. Motion Design
**Pattern:** Spring-based animations for natural feel

**Easing:** `cubic-bezier(0.25, 0.46, 0.45, 0.94)`

**Implementation:**
```javascript
transition={{ type: 'spring', damping: 25, stiffness: 300 }}
```

---

### 5. Responsive Grid
**Pattern:** 12-column grid with responsive breakpoints

**Breakpoints:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

**Implementation:**
```javascript
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
```

---

## Performance Optimizations

### 1. Code Splitting
**Strategy:** Lazy load pages and heavy components

**Implementation:**
```javascript
// React Router lazy loading
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
```

---

### 2. Animation Performance
**Strategy:** Use GPU-accelerated properties

**Best Practices:**
- Use `transform` and `opacity` for animations
- Avoid animating `width`, `height`, `left`, `top`
- Use `will-change` sparingly
- Use `useFrame` for Three.js animations

---

### 3. Bundle Optimization
**Strategy:** Tree-shaking and dynamic imports

**Implementation:**
- Named exports for tree-shaking
- Dynamic imports for 3D components
- Optimized image assets (WebP format)

---

### 4. State Optimization
**Strategy:** Selective state subscription

**Implementation:**
```javascript
// Zustand partialize
partialize: (state) => ({
  theme: state.theme,
  user: state.user,
  // Only persist essential state
})
```

---

## Security Considerations

### 1. Authentication
- JWT tokens stored in memory (Zustand)
- No localStorage/sessionStorage for sensitive data
- Protected routes check authentication status
- Token expiration handling

### 2. Input Validation
- Form validation on client side
- Sanitization of user inputs
- XSS prevention via React's built-in escaping

### 3. API Security
- HTTPS for all API calls
- CORS configuration
- Rate limiting (backend)
- Request/response encryption

---

## Accessibility (WCAG 2.1 AA)

### 1. Semantic HTML
- Proper heading hierarchy
- Semantic elements (nav, main, footer, article)
- Landmark regions

### 2. ARIA Attributes
- aria-label for icon-only buttons
- aria-expanded for toggle buttons
- aria-pressed for toggle states
- aria-hidden for decorative elements

### 3. Keyboard Navigation
- All interactive elements keyboard accessible
- Visible focus states
- Logical tab order
- Skip navigation links

### 4. Color Contrast
- Text contrast ratio ≥ 4.5:1
- Interactive elements ≥ 3:1
- Focus indicators clearly visible

---

## Testing Strategy

### 1. Unit Testing
- Component testing with React Testing Library
- State management testing
- Utility function testing

### 2. Integration Testing
- Route protection
- Form submissions
- API integration

### 3. E2E Testing
- Critical user flows
- Cross-browser testing
- Mobile responsiveness

---

## Deployment Strategy

### 1. Build Process
- Vite for fast development builds
- Production optimization
- Asset minification
- Source maps for debugging

### 2. Environment Variables
- API endpoints
- Feature flags
- Configuration settings

### 3. CI/CD
- Automated testing
- Build verification
- Deployment automation

---

## Future Enhancements

### 1. Next.js Migration
- Server-side rendering
- Static site generation
- API routes
- Improved SEO

### 2. TypeScript Adoption
- Type safety
- Better IDE support
- Reduced runtime errors
- Improved documentation

### 3. ShadCN UI Integration
- Pre-built components
- Consistent design system
- Accessibility built-in
- Customizable themes

### 4. Advanced Features
- Real-time WebSocket integration
- Advanced data visualization
- Multi-language support
- Offline capabilities (PWA)

---

## Development Guidelines

### 1. Code Style
- Use functional components
- Hooks for state and side effects
- Consistent naming conventions
- Clear component responsibilities

### 2. File Organization
- One component per file
- Related components in same folder
- Clear file naming
- Avoid deep nesting

### 3. Performance
- Memoize expensive computations
- Use React.memo for pure components
- Lazy load heavy components
- Optimize re-renders

### 4. Documentation
- Comment complex logic
- Document component props
- Maintain README files
- Update architecture docs

---

## Dependencies

### Core Dependencies
- React 18.x
- React Router 6.x
- Zustand 4.x
- Framer Motion 10.x
- Three.js 150.x
- React Three Fiber 8.x
- Recharts 2.x
- Tailwind CSS 3.x

### Development Dependencies
- Vite 5.x
- ESLint
- Prettier
- React Hot Toast

---

## Notes

- All components follow the premium design system
- Consistent animation easing across the app
- Glass effects use backdrop-filter for performance
- 3D components are optimized with memoization
- State management uses Zustand for simplicity
- Accessibility is a priority throughout development
- Performance optimizations are applied incrementally
