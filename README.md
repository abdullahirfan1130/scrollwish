# Run this web app on Android and iOS (Capacitor)

This repository contains a small web app (`index.html`, `script.js`, `styles.css`, `assets/`). The steps below show how to wrap it with Capacitor and run on Android (Windows) and iOS (macOS).

Prerequisites
- Node.js and npm installed
- For Android: Android Studio, SDK, and Java (JDK) installed
- For iOS: Xcode (macOS only)

Quick steps (Windows -> Android)

1. Install dependencies:

```powershell
npm install
```

2. Prepare web assets (creates `www/`):

```powershell
npm run prepare:web
```

3. Initialize Capacitor (only needed once):

```powershell
npm run cap:init
```

4. Add Android platform and open in Android Studio:

```powershell
npm run cap:add:android
npm run cap:open:android
```

5. In Android Studio select a device or emulator and run the app.

Notes for iOS (requires macOS)

1. On a Mac, after `npm install` and `npm run prepare:web` run:

```bash
npm run cap:init
npm run cap:add:ios
npm run cap:open:ios
```

2. Xcode will open the workspace; choose a device or simulator and run.

Updating web code

- Edit your `index.html`, `script.js`, `styles.css`, or files under `assets/`.
- Run `npm run prepare:web` to copy changes into `www/`.
- In the native project, run `npx cap copy` or `npx cap sync` to update native projects.

Helpful commands

- Copy web assets and sync natively:

```powershell
npm run prepare:web; npx cap sync
```

Limitations
- Building iOS apps requires a Mac with Xcode. You cannot build iOS natively on Windows.
- This README assumes a local development environment. Alternatively, use cloud CI or services (e.g., GitHub Actions, Ionic Appflow) to build iOS binaries from non-macOS machines.

If you'd like, I can also:
- Add a `manifest.json` and default icons for PWA/native use.
- Add GitHub Actions workflows to build Android (and macOS/iOS using a macOS runner).
