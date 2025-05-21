const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server
const proxy = httpProxy.createProxyServer();
const backendServer = 'http://localhost:8080';

// Custom security checks
function securityCheck(req) {
  // Example: Block requests with a specific user agent
  const userAgent = req.headers['user-agent'];
  if (userAgent && userAgent.includes('BadBot')) {
    return false;
  }
  return true;
}

// Create an HTTP server
const server = http.createServer((req, res) => {
  if (!securityCheck(req)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Forbidden: Security check failed');
    return;
  }

  // Forward the request to the backend server
  proxy.web(req, res, { target: backendServer }, (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  });
});

// Start the server
server.listen(8000, () => {
  console.log('Security reverse proxy running on port 8000...');
});