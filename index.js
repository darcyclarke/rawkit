{
  const fs = require('fs')
  const opn = require('opn')
  const argv = require('yargs').argv
  const exec = require('child_process').exec
  const http = require('http')

  const server = http.createServer()
  const port = argv.port || 1337

  let args = process.argv.splice(2, process.argv.length).join(' ')
  let cmd = `node --inspect ${args}`
  let child = exec(cmd, { shell: true })
  let search = true

  server.on('request', (req, res) => {
    fs.readFile('./extension/index.html', 'utf8', (err, data) => {
      if (err) throw err
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(data)
    })
  }).listen(port)

  function parse (str) {
    let re = /\schrome-devtools[^\s]*|^chrome-devtools[^\s]*/gi
    let matches = str.match(re)
    return (matches) ? matches[0] : null
  }

  function handle (data) {
    let link = parse(data)
    if (search && link) {
      console.log(`http://localhost:${port}/?rawkit=${encodeURIComponent(link)}`)
      opn(`http://localhost:${port}/?rawkit=${encodeURIComponent(link)}`, { app: ['google chrome canary'], wait: false }).then(() => {
        console.log('opened!')
      })
      search = false
    }
    process.stdout.write(data)
  }

  child.stdout.on('data', handle)
  child.stderr.on('data', handle)

  child.on('close', _ => process.exit())
  process.on('exit', _ => child.kill())
}
