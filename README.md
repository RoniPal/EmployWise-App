# EmployWise

## Download Release APK Directly [EmployWise.apk]
Drive Link : https://drive.google.com/file/d/1gy4MgQ71NvgguqituSYqJPcXp0tOoB7y/view?usp=drive_link

## Android Download 
- After Download Release Apk install
- Secrity Check Through the Play Protect
- Click On Install Button

## Project Overview
EmployWise is a React Native application designed to manage employees efficiently. It provides user authentication, listing functionalities, and user management features.

## Prerequisites
Before running this project, ensure you have the following installed:
- Node.js (LTS version recommended)
- npm or yarn
- React Native CLI (`npm install -g react-native-cli`)
- Android Studio (for Android development)
- Xcode (for iOS development - macOS only)

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/employwise.git
   cd employwise
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
   OR
   ```bash
   yarn install
   ```

## Running the Application
### On Android Emulator/Device
1. Start Metro Bundler:
   ```bash
   npx react-native start
   ```
2. Open a new terminal and run:
   ```bash
   npx react-native run-android
   ```

### On iOS Emulator (Mac Only)
1. Install CocoaPods dependencies:
   ```bash
   cd ios
   pod install
   cd ..
   ```
2. Run the app:
   ```bash
   npx react-native run-ios
   ```

## API Usage
This app fetches user data from `https://reqres.in/api/users?page={page}` for testing purposes.

## Key Features
- **User Login:** Email and password authentication
- **User Listing:** Fetch and display users from API
- **Pagination:** Navigate between user lists
- **User Management:** Edit and delete users
- **Local Storage:** Uses AsyncStorage for session handling

## Assumptions & Considerations
- The app uses `reqres.in` as a placeholder API.
- Authentication is simulated using a token stored in `AsyncStorage`.
- Data does not persist beyond API constraints (mock API usage).

## Building APK
To generate an APK, run:
```bash
cd android
./gradlew assembleRelease
```
The APK will be located at `android/app/build/outputs/apk/release/app-release.apk`.
