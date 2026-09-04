#!/bin/sh
set -e

echo "=== [Xcode Cloud] Installing Node.js & CocoaPods ==="
brew install node cocoapods

echo "=== [Xcode Cloud] Building frontend mobile web assets ==="
cd "$CI_PRIMARY_REPOSITORY_PATH/frontend"
npm install
npm run build:mobile

echo "=== [Xcode Cloud] Installing CocoaPods in App directory ==="
cd "$CI_PRIMARY_REPOSITORY_PATH/frontend/ios/App"
pod install

echo "=== [Xcode Cloud] Setup Complete ==="