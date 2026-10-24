# SignalsPro Android cloud build

This project builds a debug-signed Android APK in GitHub Actions without requiring Android Studio on your computer.

## What it does
- Packages the current `app.html` from `Tumza89/SignalsPro` into the APK at build time.
- Opens the packaged app directly (not the landing page).
- Keeps JavaScript and local storage enabled and permits internet access for the existing Google Apps Script login and app data.
- Does not modify your live website files.

## Build steps
1. Download and unzip this folder.
2. Copy the `android-cloud-build` folder contents into the **root** of your `SignalsPro` GitHub repository, preserving the `.github/workflows/build-android.yml` path.
   - If GitHub asks whether to merge folders, choose merge.
   - Do not replace `index.html`, `app.html`, `manifest.json`, or `sw.js`.
3. Commit the new files to the `main` branch.
4. In GitHub, open the repository's **Actions** tab.
5. Select **Build SignalsPro Android APK** and click **Run workflow** (or wait for the push-triggered run).
6. Wait for the workflow to finish successfully. Open the completed run and download the `SignalsPro-debug-apk` artifact.
7. Unzip the artifact to obtain `app-debug.apk`.

## Important
- This first build is a debug-signed APK for direct testing, not a Play Store release.
- The workflow downloads the latest `app.html` from the repository when it builds, so the APK uses the current committed app source.
- The app requires internet access for subscriber verification and any remote market/data feeds.
- Test login and app features on an Android phone before publishing the APK. Android WebView behavior, CORS, and external services need real-device testing.
- The APK is not hosted on the public landing page yet. After the build succeeds, upload the APK to the repository as `SignalsPro.apk` (GitHub's regular file-size limit applies) or use GitHub Releases, then link both landing-page download buttons to the hosted file.
