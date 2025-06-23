// This script will help search for potential typography package issues
const fs = require('fs');
const path = require('path');

// Function to recursively search files
function searchFiles(dir, searchString) {
  const results = [];
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...searchFiles(filePath, searchString));
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx'))) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes(searchString)) {
          results.push({
            file: filePath,
            content: content
          });
        }
      } catch (err) {
        console.error(`Error reading file ${filePath}:`, err);
      }
    }
  }
  
  return results;
}

// Search for potential typography issues
const typographyImports = searchFiles('src', 'typography-theme-github');
console.log('Files importing typography-theme-github:');
typographyImports.forEach(result => {
  console.log(`File: ${result.file}`);
  
  // Extract the import line
  const lines = result.content.split('\n');
  for (const line of lines) {
    if (line.includes('typography-theme-github')) {
      console.log(`Import: ${line.trim()}`);
    }
  }
  console.log('---');
});

// Search for any Typography.ts or typography.ts file
const rootDir = 'src';
let typographyFile = null;

function findTypographyTs(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const result = findTypographyTs(filePath);
      if (result) return result;
    } else if (stat.isFile() && (file.toLowerCase() === 'typography.ts' || file.toLowerCase() === 'typography.js')) {
      return filePath;
    }
  }
  
  return null;
}

typographyFile = findTypographyTs(rootDir);

if (typographyFile) {
  console.log(`Found typography file: ${typographyFile}`);
  console.log('Content:');
  console.log(fs.readFileSync(typographyFile, 'utf8'));
} else {
  console.log('No Typography.ts file found.');
}
