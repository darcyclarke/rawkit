
const http = require('http')
const server = http.createServer()

console.log('hello!')

server.on('request', (req, res) => {
  console.log(req, res)
})

server.listen(8080)
