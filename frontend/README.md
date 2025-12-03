# Trae Nutrition Frontend

A modern Next.js frontend application for the Trae Nutrition platform.

## Features

- 🔐 User authentication (login/register)
- 📊 Dashboard with nutrition and workout overview
- 🍽️ Meal tracking and meal plan management
- 💪 Workout logging and workout plans
- 📈 Progress tracking with weight and body measurements
- 👤 User profile management

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Recharts** - Chart library for progress visualization
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Development

```bash
# Run development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
# Create production build
npm run build

# Start production server
npm start
```

## Project Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── dashboard/    # Dashboard page
│   │   ├── meals/        # Meals management
│   │   ├── workouts/     # Workouts management
│   │   ├── progress/     # Progress tracking
│   │   ├── profile/      # User profile
│   │   ├── login/        # Login page
│   │   └── register/     # Registration page
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities and API client
│   └── types/            # TypeScript type definitions
├── public/               # Static assets
└── package.json          # Dependencies
```

## API Integration

The frontend communicates with the backend API through the API client in `src/lib/api.ts`. All API endpoints are configured to use the backend URL specified in `NEXT_PUBLIC_API_URL`.

### Available API Modules

- `authAPI` - Authentication (login, register, refresh)
- `userAPI` - User profile management
- `mealsAPI` - Meal tracking and meal plans
- `workoutsAPI` - Workout logging and plans
- `progressAPI` - Weight and measurement tracking
- `healthAPI` - Health check endpoints

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API URL (default: http://localhost:8080)

## Features Overview

### Authentication
- User registration and login
- JWT token-based authentication
- Protected routes
- Automatic token refresh

### Dashboard
- Overview of daily nutrition intake
- Total calories and macros
- Recent meals and workouts
- Current weight tracking

### Meals
- Log meals with nutritional information
- Create and manage meal plans
- View meal history

### Workouts
- Log workouts with duration and calories burned
- View workout plans
- Track workout history

### Progress
- Weight tracking with chart visualization
- Body measurements logging
- Progress history

### Profile
- View and edit user profile
- Set personal goals
- Update health metrics

## Development Notes

- The app uses Next.js App Router (not Pages Router)
- All pages are client components for interactivity
- Authentication state is managed via React Context
- API requests include automatic token injection
- Protected routes redirect to login if not authenticated
