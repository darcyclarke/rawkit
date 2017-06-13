const http = require('http')
const server = http.createServer()
const port = 8888

server.on('request', (req, res) => {
  console.log('request', req)
  res.end('server is running...')
}).listen(port)

console.log(`server started running at: http://localhost:${port}/`)
