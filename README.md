# Expo Android + AI-style E2E test sample

This sample contains:
- a tiny Expo React Native app
- a Maestro UI test
- a Node/TypeScript-style test controller using ADB/Logcat
- scripts for installing, launching, screenshotting, and collecting logs

## Requirements

- Node.js 20+
- Android SDK + `adb` on PATH
- a physical Android phone with USB debugging enabled
- Java/Android build tooling suitable for Expo
- Maestro CLI

## 1. Create/install the Expo app

```bash
rm -rf android #only needed to reinitate a clean build
npm install
npx expo prebuild --platform android
npx expo run:android --device
```

The command builds and installs the native Android app on a connected device.

If you already have an APK, you can install it with:

```bash
adb install -r path/to/app.apk
```

## 2. Run the deterministic UI test

```bash
npm run test:maestro
```

The test:
1. launches the app
2. enters a name
3. presses the button
4. verifies the greeting
5. intentionally tries an empty name
6. verifies the validation message

## 3. Run the ADB/log controller

First make sure exactly one device is connected:

```bash
adb devices
```

Then:

```bash
npm run test:controller
```

This clears Logcat, launches the app, waits, captures the screen, and saves Logcat output under `artifacts/`.

## 4. Hooking this into an AI agent

The controller is deliberately separated from the test logic. An AI agent can call the same operations:

- `adb shell input tap ...`
- `adb shell input text ...`
- `adb exec-out screencap -p`
- `adb logcat`
- `adb shell am force-stop ...`
- `adb shell monkey ...`

A useful next step is to expose these as MCP/tools for your coding agent and let the agent run an observe → act → observe loop.

## Package name

`com.example.aiautomationdemo`

If you change it, update:
- `app.json`
- `maestro/basic-flow.yaml`
- `scripts/test-controller.mjs`
