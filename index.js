#!/usr/bin/env node
'use strict'

const fs = require('fs')
const opn = require('opn')
const http = require('http')
const exec = require('child_process').exec
const yargs = require('yargs')
const server = http.createServer()
const caution = `Caution: Headless mode is available on Mac and Linux in Chrome 59. Windows support is coming in Chrome 60. To check what version of Chrome you have, open chrome://version. \n Read more: https://developers.google.com/web/updates/2017/04/headless-chrome`
const chrome = require('lighthouse/chrome-launcher/chrome-launcher')

let argv = yargs
  .version()
  .usage('rawkit [options] <file ...>')
  .option('canary', {
    alias: 'c',
    describe: 'Run the devtools in canary.'
  })
  .option('no-prompt', {
    alias: 'np',
    describe: 'Disable the automatic opening of the browser'
  })
  .option('silent', {
    alias: 's',
    describe: 'Hide stdout/stderr output from child process'
  })
  .option('headless', {
    alias: 'l',
    describe: 'Run chrome in a headless environment. This will disable prompting'
  })
  .option('headless-port', {
    alias: 'p',
    describe: 'Define a specific port to run headless chrome in. Must be used in tandem with --headless. Defaults to 9222.'
  })
  .option('extension-port', {
    alias: 'e',
    describe: 'Define a specific port to run the extension server on. Defaults to 9223.'
  })
  .argv

let caught = false
const browser = `google chrome ${argv.canary ? 'canary' : ''}`.trim()
const port = argv.port || 1337
const args = argv._.splice(2, argv._.length).join(' ')

function parse (str) {
  let re = /\schrome-devtools[^\s]*|^chrome-devtools[^\s]*/gi
  let matches = str.match(re)
  return (matches) ? matches[0] : null
}

function handle (data) {
  let link = parse(data)
  if (!caught && link && !argv['no-prompt']) {
    opn(
      `http://localhost:${port}/?rawkit=${encodeURIComponent(link)}`,
      {
        app: [ browser ],
        wait: false
      }
    )
    .then(() => {})
    .catch((e) => {})
    caught = true
  }
  if (!argv.silent) {
    process.stdout.write(data)
  }
}

if (argv.headless) {
  process.stdout.write(caution)
  chrome.launch({
    port: 9222,
    chromeFlags: [
      '--window-size=412,732',
      '--disable-gpu',
      '--headless'
    ]
  })
} else {
  const child = exec(`node --inspect ${args}`, { shell: true })
  server.on('request', (req, res) => {
    fs.readFile('./extension/index.html', 'utf8', (err, data) => {
      if (err) throw err
      res.writeHead(200, { 'Content-Type': 'text/html' })
      res.end(data)
    })
  }).listen(port)

  child.stdout.on('data', handle)
  child.stderr.on('data', handle)

  child.on('close', _ => process.exit())
  process.on('exit', _ => child.kill())
}
