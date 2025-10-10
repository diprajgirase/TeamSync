const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const ncp = promisify(require('ncp').ncp);

async function copyFiles() {
  try {
    const distDir = path.join(__dirname, '..', 'dist');
    
    // Create dist directory if it doesn't exist
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }

    // Copy package.json
    await promisify(fs.copyFile)(
      path.join(__dirname, '..', 'package.json'),
      path.join(distDir, 'package.json')
    );

    // Copy client dist files
    const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
    const frontendDist = path.join(distDir, 'frontend');
    
    if (fs.existsSync(clientDist)) {
      await ncp(clientDist, frontendDist, {
        clobber: true,
        stopOnErr: true
      });
      console.log('Successfully copied client files');
    } else {
      console.warn('Client dist directory not found, skipping...');
    }

    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Error during build:', error);
    process.exit(1);
  }
}

copyFiles();
