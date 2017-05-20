
const http = require('http')
const server = http.createServer()

server.on('request', (req, res) => {
  console.log('request', req)
  res.end('server is running...')
}).listen(8080)

console.log('server started running at: http://localhost:8080/')
