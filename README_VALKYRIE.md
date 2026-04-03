# Valkyrie Network - Startup Ecosystem Platform

A complete production-ready frontend for connecting founders, mentors, and investors in the startup ecosystem.

## Features

- **Landing Page**: Beautiful hero section with features and statistics
- **Authentication**: Login, Signup, and Onboarding flows
- **Dashboard**: Metrics, activity feed, and quick actions
- **Profile Management**: View and edit founder profiles
- **Founder Intelligence**: AI-powered insights on founder DNA and traits
- **Smart Matching**: Find co-founders based on compatibility
- **Startup Builder**: Create and track startup progress
- **Settings**: Manage account preferences and notifications

## Tech Stack

- **Framework**: Next.js 13 (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Custom Components
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
├── app/                          # Next.js App Router pages
│   ├── auth/                     # Authentication pages
│   │   ├── login/
│   │   ├── signup/
│   │   └── onboarding/
│   ├── dashboard/                # Main dashboard
│   ├── profile/                  # User profile
│   ├── founder-intelligence/     # Founder DNA insights
│   ├── matching/                 # Co-founder matching
│   ├── startups/                 # Startup builder
│   ├── settings/                 # Settings page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
│
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── loader.jsx
│   │   ├── progress-circle.jsx
│   │   ├── skeleton-loader.jsx
│   │   └── empty-state.jsx
│   ├── cards/                    # Card components
│   │   ├── metric-card.jsx
│   │   └── match-card.jsx
│   └── navigation/               # Navigation components
│       ├── sidebar.jsx
│       └── navbar.jsx
│
├── layouts/                      # Layout components
│   └── main-layout.jsx          # Main app layout with sidebar
│
├── store/                        # Zustand state stores
│   ├── authStore.js             # Authentication state
│   ├── dashboardStore.js        # Dashboard state
│   ├── matchStore.js            # Matching state
│   └── startupStore.js          # Startup state
│
├── services/                     # API services
│   ├── api.js                   # Axios configuration
│   ├── authService.js           # Auth endpoints
│   ├── matchService.js          # Matching endpoints
│   ├── startupService.js        # Startup endpoints
│   └── dashboardService.js      # Dashboard endpoints
│
└── utils/                        # Utilities
    ├── constants.js             # App constants
    ├── helpers.js               # Helper functions
    └── dummyData.js            # Dummy data for development
```

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

### Available Routes

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/auth/onboarding` - Onboarding flow
- `/dashboard` - Main dashboard (requires auth)
- `/profile` - User profile
- `/founder-intelligence` - Founder DNA insights
- `/matching` - Co-founder matching
- `/startups` - Startup builder
- `/settings` - Settings

## Design System

### Colors

- **Background**: Black (#000000)
- **Surface**: Zinc-900 (#18181b)
- **Border**: Zinc-800 (#27272a)
- **Primary**: Yellow-500 (#eab308)
- **Text**: White/Zinc shades

### Components

All components follow a consistent design pattern:
- Dark theme optimized
- Hover animations with Framer Motion
- Responsive design (mobile, tablet, desktop)
- Gold accent colors for CTAs and highlights

## State Management

The app uses Zustand for state management with the following stores:

- **authStore**: User authentication and profile data
- **dashboardStore**: Dashboard metrics and notifications
- **matchStore**: Co-founder matches and filters
- **startupStore**: Startup data and team management

## Dummy Data

The application uses dummy data for development located in `utils/dummyData.js`:
- Sample user profiles
- Match data with compatibility scores
- Startup information
- Activity feeds
- Notifications

## Key Features Implementation

### Authentication
- Email/password validation
- Role selection (Founder, Investor, Mentor)
- Onboarding flow with skill selection
- Persistent authentication with Zustand

### Dashboard
- Real-time metrics cards
- Activity feed
- Quick actions for common tasks
- Startup progress tracking

### Founder Intelligence
- DNA score visualization
- Trait analysis with progress bars
- Strengths and blind spots
- Ideal co-founder recommendations

### Matching System
- Advanced filtering by skills, location, match score
- Real-time search
- Compatibility visualization
- Connect and message actions

### Startup Builder
- Create and manage startups
- Team member management
- Milestone tracking
- Progress visualization

## Notes

- This is a frontend-only implementation
- All API calls are mocked with dummy data
- Authentication is simulated with local storage
- No actual backend integration required
- Production build may have known issues with Radix UI Progress component

## Future Enhancements

- Real backend API integration
- WebSocket for real-time updates
- Advanced analytics
- Payment integration
- Messaging system
- Video calls
- Community features

## License

Proprietary - Valkyrie Network 2024
