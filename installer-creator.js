const electronInstaller = require('electron-winstaller');
const fs = require('fs');

fs.rmSync('./dist/electron/installer64', { recursive: true, force: true });

console.log('Creating installer');
electronInstaller
  .createWindowsInstaller({
    appDirectory: './dist/electron/Wave-win32-ia32',
    outputDirectory: './dist/electron/installer64',
    authors: 'Kokapuk Inc.',
    exe: 'Wave.exe',
    noDelta: true,
    noMsi: true,
    setupIcon: './public/favicon.ico',
    setupExe: 'WaveSetup.exe',
    // certificateFile: './cert.pfx',
    // certificatePassword: 'this-is-a-secret',
  })
  .then(() => {
    console.log('Installer created!');
  })
  .catch((e) => {
    console.log(`No dice: ${e.message}`);
  });
