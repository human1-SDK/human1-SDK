import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SDK_ROOT = path.resolve(__dirname, '../../../../human1-SDK');
const NODE_MODULES = path.resolve(__dirname, '../node_modules/@human1-sdk');

// Ensure the @human1-sdk directory exists
if (!fs.existsSync(NODE_MODULES)) {
  fs.mkdirSync(NODE_MODULES, { recursive: true });
}

// Remove existing symlinks if they exist
['ui', 'core'].forEach(pkg => {
  const symlinkPath = path.join(NODE_MODULES, pkg);
  if (fs.existsSync(symlinkPath)) {
    try {
      // Check if it's a symlink
      const stats = fs.lstatSync(symlinkPath);
      if (stats.isSymbolicLink()) {
        fs.unlinkSync(symlinkPath);
      } else {
        // If it's a directory or file, remove it recursively
        if (stats.isDirectory()) {
          fs.rmSync(symlinkPath, { recursive: true, force: true });
        } else {
          fs.unlinkSync(symlinkPath);
        }
      }
    } catch (err) {
      console.error(`Error removing existing ${pkg}:`, err);
    }
  }
});

// Create new symlinks
['ui', 'core'].forEach(pkg => {
  const targetPath = path.join(SDK_ROOT, 'packages', pkg);
  const symlinkPath = path.join(NODE_MODULES, pkg);
  
  if (!fs.existsSync(targetPath)) {
    console.error(`Error: SDK package ${pkg} not found at ${targetPath}`);
    process.exit(1);
  }

  try {
    fs.symlinkSync(targetPath, symlinkPath, 'junction');
    console.log(`Created symlink for @human1-sdk/${pkg}`);
  } catch (err) {
    console.error(`Error creating symlink for ${pkg}:`, err);
    process.exit(1);
  }
});

console.log('SDK packages linked successfully!'); 