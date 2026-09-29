const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const files = [
  'server.js',
  'src/db.js',
  'src/middleware/auth.js',
  'scripts/seed.js',
  ...fs.readdirSync(path.join(__dirname, '..', 'src', 'routes'))
    .filter(file => file.endsWith('.js'))
    .map(file => path.join('src', 'routes', file))
];

for (const file of files) cp.execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
console.log(`Syntax OK: ${files.length} files`);
