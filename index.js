#!/usr/bin/env node
'use strict'

const fs = require('fs')
const opn = require('opn')
const http = require('http')
const exec = require('child_process').exec
const yargs = require('yargs')
const server = http.createServer()

let argv = yargs
  .version()
  .usage('rawkit [options] <file ...>')
  .option('port', {
    alias: 'p',
    describe: 'Define a specific port to run the proxy server on. Defaults to 1337.'
  })
  .option('canary', {
    alias: 'c',
    describe: 'If you want to run the devtools in canary.'
  })
  .argv

const browser = `google chrome ${argv.canary ? 'canary' : ''}`.trim()
const port = argv.port || 1337
const args = argv._.splice(2, argv._.length).join(' ')
const child = exec(`node --inspect ${args}`, { shell: true })
var caught = false

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
  if (!caught && link) {
    opn(`http://localhost:${port}/?rawkit=${encodeURIComponent(link)}`, { app: [ browser ], wait: false }).then(() => {})
    caught = true
  }
  process.stdout.write(data)
}

child.stdout.on('data', handle)
child.stderr.on('data', handle)

child.on('close', _ => process.exit())
process.on('exit', _ => child.kill())

module.exports = () => {}
