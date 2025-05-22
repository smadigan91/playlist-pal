import http from 'http';
import httpProxy from 'http-proxy';
import fs from 'fs';

// NOTE: configure this to point to your backend server
const backendServer = 'http://host.docker.internal:8080';
const proxy = httpProxy.createProxyServer({ target: backendServer });

function generatelogObj(req, message) {
  return {
    level: 'error',
    message: message,
    method: req.method,
    ipAddress: req.socket.remoteAddress,
    timestamp: new Date().toISOString(),
    url: req.url
  }
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  // NOTE: Before security checks, we can limit the number of requests from a single IP
  //   This can be done using a library or in simple in memory implementation

  // Security check: Validate the request URL
  const allowedPaths = ['/login', '/me'];
  const isPathAllowed = allowedPaths.includes(req.url);
  // Simple path check matching against exact paths
  // A regex can be used for more complex path matching
  if (!isPathAllowed) {
    const logObj = generatelogObj(req, 'Path not allowed');
    fs.appendFile('/var/log/proxy_errors.log', JSON.stringify(logObj), (err) => {
      if (err) console.error('Failed to write to log file:', err.message);
    });

    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden');
    return;
  }

  // Security check: Validate the request method
  const allowedMethods = ['GET', 'OPTIONS', 'POST'];
  if (!allowedMethods.includes(req.method)) {
    const logObj = generatelogObj(req, 'Method not allowed')
    fs.appendFile('/var/log/proxy_errors.log', JSON.stringify(logObj), (err) => {
      if (err) console.error('Failed to write to log file:', err.message);
    });

    res.writeHead(405, { 'Content-Type': 'text/plain' });
    res.end('Method Not Allowed');
    return;
  }

  // NOTE: Another example of a security check could be to check for specific headers

  console.log(`Proxying request: ${req.method} ${req.url}`);

  // Forward the request to the backend server
  proxy.web(req, res, null, (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
});

// Start the server
server.listen(8000, () => {
  console.log('Security reverse proxy running on port 8000...');
});