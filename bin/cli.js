'use strict'

const fs = require('fs')
const opn = require('opn')
const url = require('url')
const path = require('path')
const http = require('http')
const exec = require('child_process').exec
const yargs = require('yargs')

class CLI {
  constructor (args) {
    this.parseArguments(args)
    this.port = this.args.extension || 1337
    this.prefix = 'ws://'
    this.devtools = 'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws='
    this.image = { path: '../extension/icon.png', type: 'image/png' }
    this.index = { path: '../extension/index.html', type: 'text/html' }
    this.caught = false
    this.browser = `google chrome ${this.args.canary ? 'canary' : ''}`.trim()
  }

  get props () {
    return {
      args: this.args,
      browser: this.browser,
      port: this.port
    }
  }

  parseArguments (args) {
    this.args = yargs
      .version()
      .demandCommand(1)
      .usage('rawkit [options] <file ...>')
      .alias('v', 'version')
      .version(() => require('../package').version)
      .describe('v', 'show version information')
      .alias('h', 'help')
      .help('help')
      .usage('Usage: $0 -x [num]')
      .showHelpOnFail(false, 'Specify --help for available options')
      .option('canary', {
        alias: 'c',
        describe: 'Run the devtools in canary.',
        boolean: true
      })
      .option('inspect-brk', {
        alias: 'brk',
        describe: 'To break on the first line of the application code.',
        boolean: true
      })
      .option('silent', {
        alias: 's',
        describe: 'Hide stdout/stderr output from child process.',
        boolean: true
      })
      .option('extension', {
        alias: 'e',
        describe: 'Define a specific port to run the extension server on. Defaults to 1337.',
        type: 'number'
      })
      .parse(args)
  }

  parseURL (str) {
    const re = /(\b(ws?|chrome-devtools):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    const matches = str.match(re)
    const link = (matches) ? matches[0] : null
    const isNew = link && link.indexOf(this.prefix) >= 0
    return (isNew) ? `${this.devtools}${link.replace(this.prefix, '')}` : link
  }

  exec () {
    const o = process.argv
    const args = o.splice(o.indexOf(this.args._[2]), o.length).join(' ')
    const cmd = (this.args._.brk) ? '--inspect-brk' : '--inspect'
    let nodemonConfig
    let execCommand = 'node'

    try {
      nodemonConfig = fs.readFileSync('nodemon.json', 'utf8')
      execCommand = nodemonConfig.execMap.js
    } catch (err) {}

    this.child = exec(`${execCommand} ${cmd} ${args}`, { shell: true })
    this.child.stdout.on('data', this.handle.bind(this))
    this.child.stderr.on('data', this.handle.bind(this))
    this.child.on('close', _ => process.exit())
    process.on('exit', _ => this.child.kill())
  }

  handle (data) {
    const ref = this.parseURL(data)
    if (!this.caught && ref && !this.args['no-prompt']) {
      const link = `http://localhost:${this.port}/?rawkit=${encodeURIComponent(ref)}`
      const opts = {
        app: [this.browser],
        wait: false
      }
      opn(link, opts)
        .then(() => {})
        .catch((e) => {})
      this.caught = true
      if (!this.args.silent) {
        console.log('\x1b[33m%s\x1b[0m', 'Devtools URL:', ref)
      }
    } else if (!this.args.silent) {
      process.stdout.write(data)
    }
  }

  start () {
    this.server = http.createServer()
    this.server.on('request', (req, res) => {
      const request = url.parse(req.url, true)
      const image = request.pathname.indexOf('.png') >= 0
      const file = (image) ? this.image : this.index
      fs.readFile(path.resolve(__dirname, file.path), (err, data) => {
        if (err) throw err
        res.writeHead(200, { 'Content-Type': file.type })
        if (image) {
          res.end(data, 'binary')
        } else {
          res.end(data.toString())
        }
      })
    }).listen(this.port)
  }
}

module.exports = (args) => {
  return new CLI(args)
}
