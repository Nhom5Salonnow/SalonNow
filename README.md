# SalonNow

A React Native mobile application for booking salon services. Users can browse salons, view service menus, check availability, and book appointments.

> This project is developed by **Group 5** as part of the Mobile Development (CO3043) course, class CN01.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React Native | 0.81.5 | Mobile framework |
| Expo | 54 | Development platform |
| Expo Router | v6 | File-based navigation |
| TypeScript | 5.9 | Type safety |
| NativeWind | 4.2.1 | TailwindCSS styling |
| Axios | - | HTTP client |
| Jest | - | Testing framework |
| Sentry | 7.2.0 | Error tracking |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Installation

```bash
git clone https://github.com/Nhom5Salonnow/SalonNow.git
cd SalonNow
npm install
```

### Running the App

```bash
npx expo start      # Start development server
npm run android     # Run on Android
npm run ios         # Run on iOS
npm run web         # Run on web browser
```

## Project Structure

```
SalonNow/
├── app/                    # Screens (Expo Router)
│   ├── (tabs)/            # Main tab navigation
│   │   ├── home.tsx
│   │   ├── bookings.tsx
│   │   ├── notifications.tsx
│   │   └── profile.tsx
│   ├── admin/             # Admin screens
│   ├── auth/              # Login, Signup
│   ├── service/           # Service detail, Choose stylist
│   └── waitlist/          # Waitlist management
│
├── api/                   # API layer
│   ├── apiClient.ts       # Axios instance
│   ├── authApi.ts
│   ├── bookingApi.ts
│   ├── serviceApi.ts
│   └── ...
│
├── components/
│   ├── common/            # Shared components
│   ├── ui/                # UI components
│   └── salon/             # Domain components
│
├── contexts/              # React Context
├── constants/             # App constants
├── hooks/                 # Custom hooks
├── types/                 # TypeScript types
├── utils/                 # Utilities
└── __tests__/             # Test files
```

## Features

### Customer
- Browse services and categories
- View stylist profiles
- Book appointments
- Join waitlist
- View booking history
- Leave reviews
- Manage payments
- Notifications

### Admin
- Dashboard analytics
- Manage services
- Manage staff
- Handle appointments
- View feedback

## API

| Item | URL |
|------|-----|
| Base URL | `http://35.240.204.147:3000` |
| Swagger Docs | `http://35.240.204.147:3000/api` |

Configuration: `api/apiClient.ts`

## Testing

```bash
npm test                              # Run all tests (watch mode)
npm test -- --watchAll=false          # Run once (CI mode)
npm run test:coverage                 # With coverage report
npm test -- --testPathPattern="Home"  # Run specific test
```

Coverage report: `coverage/index.html`

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run on web |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
| `npm run test:coverage` | Tests with coverage |

## Build (EAS)

```bash
eas login
eas build --profile development --platform android
eas build --profile development --platform ios
```

## CI/CD

- GitHub Actions runs tests on PRs
- SonarCloud code quality analysis
- Coverage threshold: 80%

## Team

**Group 5 - CO3043 Mobile Development**

## License

Proprietary - All rights reserved.
