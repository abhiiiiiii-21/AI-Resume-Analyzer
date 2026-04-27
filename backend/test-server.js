const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, message: 'Node is working' }));
});
server.listen(5002, () => {
  console.log('Test server on 5002');
});
