// Serves the frontend (project root) at http://127.0.0.1:5500 using only Node built-ins.
// The backend folder and dotfiles are never served, so .env stays private.
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const port = Number(process.env.FRONTEND_PORT || 5500);

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json'
};

http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch {
    res.writeHead(400).end('Bad request');
    return;
  }

  let filePath = path.join(root, urlPath);
  const relative = path.relative(root, filePath);
  const blocked = relative.startsWith('..') || path.isAbsolute(relative)
    || relative.split(path.sep).some(part => part === 'backend' || part === 'node_modules' || part.startsWith('.'));
  if (blocked) {
    res.writeHead(404).end('Not found');
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404).end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
    res.end(data);
  });
}).on('error', error => {
  if (error.code !== 'EADDRINUSE') throw error;
  console.log(`Port ${port} is already in use (probably Live Server). The website is already running on http://127.0.0.1:${port}/`);
}).listen(port, '127.0.0.1', () => {
  console.log(`Giri Darshan website running on http://127.0.0.1:${port}/`);
});
