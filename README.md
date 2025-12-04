# SalonNow

SalonNow is a modern mobile application that streamlines the process of booking and experiencing salon services. With just a few taps, users can:

- Browse a wide range of salons conveniently.
- View detailed service menus.
- Check real-time availability.
- Secure appointments instantly.

This project is developed by Group 5 as part of the Mobile Development (CO3043) course, class CN01.

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## 🧪 Testing Guide

This project uses **Jest** and **React Native Testing Library** to test both UI components and application logic.

### 1. Run all tests

```bash
npm run test
```

This command will:

- Execute all test files inside the `__tests__/` directory
- Display pass/fail results in the terminal
- Automatically watch file changes in development mode

### 2. Run tests with coverage report

```bash
npm run test:coverage
```

This command will:

- Generate a **coverage report**
- Export results to:

```
coverage/
└── index.html
```

You can open `coverage/index.html` in your browser to view a detailed coverage dashboard (statements, branches, functions, lines).

[![React Native CI - Test, Report & SonarCloud](https://github.com/Nhom5Salonnow/SalonNow/actions/workflows/test.yml/badge.svg)](https://github.com/Nhom5Salonnow/SalonNow/actions/workflows/test.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Nhom5Salonnow_SalonNow&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Nhom5Salonnow_SalonNow)
