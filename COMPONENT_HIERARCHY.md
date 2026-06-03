# NPIG Component Hierarchy Documentation

## Overview
This document outlines the component hierarchy and structure of the NPIG (National Predictive Intelligence Grid) application. The application is built with React, Framer Motion, Three.js, and Tailwind CSS, following a premium design system inspired by Apple, OpenAI, Stripe, and Tesla.

## Application Structure

### Entry Points
- **App.jsx** - Main application entry point with React Router configuration
- **index.html** - HTML template with font imports
- **index.css** - Global styles, design system, and theme definitions

## Page Components

### 1. LandingPage.jsx
**Location:** `/src/pages/LandingPage.jsx`

**Purpose:** Public-facing homepage with hero section, features, and CTAs

**Sub-Components:**
- `HeroGlobe` - 3D animated globe with data nodes and connections
- `HeroScene` - Three.js scene setup with lighting and camera
- `NeuralBackground` - Canvas-based neural network animation
- `FeatureCard` - Interactive feature cards with glass effects
- `TrustStrip` - Partner/organization logos display
- `AnimatedStat` - Animated statistics display

**Key Features:**
- 3D globe with 60 animated data nodes
- Premium Apple-style navbar with mobile menu
- Scroll-triggered animations
- Gradient text and glassmorphism effects

---

### 2. LoginPage.jsx
**Location:** `/src/pages/LoginPage.jsx`

**Purpose:** Authentication page with multiple login methods

**Sub-Components:**
- `NeuralBackground` - Animated neural network canvas
- `HeroScene` - 3D globe scene
- `BiometricOverlay` - Biometric verification simulation
- `MFAOverlay` - Multi-factor authentication verification
- `Field` - Input field wrapper with label and icon

**Authentication Methods:**
- Email/Password credentials
- Phone OTP
- SSO (Google, Microsoft)
- Biometric verification
- MFA with device recognition

**Key Features:**
- Multi-layer scanning rings for biometric
- 6-digit OTP input with auto-focus
- Device trust management
- Premium glass effects and animations

---

### 3. DashboardPage.jsx
**Location:** `/src/pages/DashboardPage.jsx`

**Purpose:** Executive Command Center with real-time intelligence overview

**Sub-Components:**
- `StatCard` - KPI metric cards with trend indicators
- `AlertFeedItem` - Individual alert display with severity indicators
- `ZoneRiskHeatmap` - Interactive zone risk visualization
- `EventIngestionChart` - Real-time event ingestion chart
- `AIInsightsPanel` - AI-powered recommendations
- `AlertTimeline` - Chronological alert timeline

**Key Features:**
- Drag-and-drop widget customization (Reorder.Group)
- Real-time data updates via WebSocket simulation
- Interactive charts with Recharts
- Premium glass cards with ambient glows
- Responsive grid layouts (1/2/3 columns based on screen size)

---

### 4. ReportsPage.jsx
**Location:** `/src/pages/ReportsPage.jsx`

**Purpose:** AI-powered report generation and library management

**Sub-Components:**
- `AISummaryCard` - AI-generated cross-domain risk summary
- `ReportCard` - Report template card with generation trigger
- `GenerateModal` - Report generation configuration modal
- `ExportToolbar` - Export format selection (PDF, Excel, PowerPoint)

**Report Templates:**
- Traffic Intelligence Report
- Crime Hotspot Analysis
- Health Risk Assessment
- Climate Risk Report
- Cyber Threat Summary
- Executive Intelligence Brief

**Key Features:**
- AI summary with animated progress bars
- Multi-format export support
- Report library with search and filtering
- Premium modal with progress simulation

---

## Layout Components

### AppShell.jsx
**Location:** `/src/components/Dashboard/AppShell.jsx`

**Purpose:** Main authenticated application layout shell

**Sub-Components:**
- Sidebar navigation with collapsible items
- Top header with theme toggle and notifications
- Main content area with scrollable region

**Features:**
- Responsive sidebar (collapsible on mobile)
- Theme switching (dark/light)
- Real-time alert notifications
- WebSocket integration for live updates

---

## AI Components

### NexusChatbot.jsx
**Location:** `/src/components/Nexus/NexusChatbot.jsx`

**Purpose:** Floating AI assistant widget

**Sub-Components:**
- `VoiceWave` - Animated voice input indicator
- AI recommendations panel
- Chat message display
- Input area with voice support

**Features:**
- Voice input simulation
- Natural language query interface
- Real-time recommendations
- Premium glassmorphic design
- Floating action button (FAB)

---

## Footer Components

### RedesignedFooter.jsx
**Location:** `/src/components/Footer/RedesignedFooter.jsx`

**Purpose:** Premium Apple-style footer with AI ecosystem information

**Sub-Components:**
- `GlobeHero` - 3D globe visualization
- `NexusCoreWave` - Animated wave effect
- `PremiumBadge` - Premium status indicator

**Sections:**
- Product links
- AI ecosystem
- Interactive intelligence map
- Developer hub
- Legal information

---

## State Management

### useStore.js
**Location:** `/src/store/useStore.js`

**Purpose:** Global state management with Zustand

**State:**
- `user` - Current authenticated user
- `token` - JWT authentication token
- `isAuthenticated` - Authentication status
- `theme` - Current theme (dark/light)
- `alerts` - Real-time alerts
- `predictions` - AI predictions
- `nexusOpen` - NEXUS chatbot open state
- `sidebarCollapsed` - Sidebar collapse state

**Actions:**
- `setUser`, `setToken`, `logout`
- `toggleTheme`
- `setAlerts`, `updateAlertStats`
- `toggleNexus`
- `toggleSidebarCollapse`

---

## Design System

### Color Palette (Dark Mode)
- **Primary Background:** `#030712` (Deep void)
- **Secondary Background:** `#0F172A` (Slate 900)
- **Tertiary Background:** `#1E293B` (Slate 800)
- **Accent Blue:** `#3B82F6` (Blue 500)
- **Accent Violet:** `#8B5CF6` (Violet 500)
- **Accent Cyan:** `#06B6D4` (Cyan 500)

### Typography
- **Display Font:** SF Pro Display (headings)
- **Body Font:** Inter (body text)
- **Mono Font:** JetBrains Mono (code, data)

### Animation Libraries
- **Framer Motion** - Component animations and transitions
- **Three.js** - 3D globe and visualizations
- **GSAP** - Advanced animations (via CSS)

---

## Component Patterns

### Glassmorphism Pattern
Used throughout the application for premium glass effects:
```jsx
style={{
  background: 'linear-gradient(135deg, rgba(15,23,42,0.8) 0%, rgba(3,7,18,0.95) 100%)',
  border: '1px solid rgba(255,255,255,0.08)',
  backdropFilter: 'blur(20px)',
}}
```

### Ambient Glow Pattern
Multi-layer glow effects for depth:
```jsx
<div className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl"
  style={{ background: 'rgba(59,130,246,0.15)' }} />
```

### Motion Pattern
Framer Motion animations with spring physics:
```jsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
>
```

---

## Accessibility Features

### ARIA Labels
- Icon-only buttons have descriptive aria-labels
- Toggle buttons use aria-pressed/aria-expanded
- Form inputs have associated labels

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states are visible
- Tab order follows logical flow

### Color Contrast
- Text meets WCAG 2.1 AA contrast ratios
- Interactive elements have sufficient contrast
- Focus indicators are clearly visible

---

## Responsive Design

### Breakpoints
- **Mobile:** < 640px (sm)
- **Tablet:** 640px - 1024px (md, lg)
- **Desktop:** > 1024px (xl, 2xl)

### Responsive Patterns
- Grid layouts: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Typography: `text-sm sm:text-base lg:text-lg`
- Spacing: `p-4 sm:p-6 lg:p-8`
- Display: `hidden md:block` for desktop-only elements

---

## Performance Optimizations

### Code Splitting
- React Router lazy loading for pages
- Dynamic imports for heavy components

### Animation Performance
- useFrame for Three.js animations
- CSS transforms for GPU acceleration
- will-change hints for animated elements

### Bundle Size
- Tree-shaking for unused exports
- Lazy loading of 3D components
- Optimized image assets

---

## Future Enhancements

### Planned Components
- Real-time map integration
- Advanced data visualization
- Multi-language support
- Advanced reporting templates

### Architecture Improvements
- Next.js 15 migration
- TypeScript adoption
- ShadCN UI integration
- Server-side rendering

---

## Notes

- All components follow the premium design system
- Consistent animation easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Glass effects use backdrop-filter for performance
- 3D components are optimized with memoization
- State management uses Zustand for simplicity
