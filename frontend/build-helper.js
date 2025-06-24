// build-helper.js
// This script creates a package.json in the build directory to help Vercel with deployment
const fs = require('fs');
const path = require('path');

// Create a minimal package.json in the build directory
const buildPackageJson = {
  "name": "the-review-room-frontend-build",
  "version": "1.0.0",
  "private": true,
  "engines": {
    "node": ">=16.0.0"
  }
};

const buildDir = path.join(__dirname, 'build');

// Ensure the build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Write the package.json to the build directory
fs.writeFileSync(
  path.join(buildDir, 'package.json'),
  JSON.stringify(buildPackageJson, null, 2)
);

console.log('Created package.json in the build directory');
