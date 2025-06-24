// vercel-fix.js
// This is a helper script to ensure Vercel deployment works correctly

const fs = require('fs');
const path = require('path');

// Create a package.json with a minimal config that vercel can use
const buildVercelConfigFile = () => {
  const config = {
    "name": "the-review-room-vercel",
    "version": "1.0.0",
    "private": true,
    "scripts": {
      "build": "cd frontend && npm install && npm run build"
    }
  };

  fs.writeFileSync(
    path.join(__dirname, 'vercel.package.json'),
    JSON.stringify(config, null, 2)
  );
  
  console.log('Created vercel.package.json for deployment');
};

buildVercelConfigFile();
