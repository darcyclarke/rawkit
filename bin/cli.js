'use strict'

const fs = require('fs')
const opn = require('opn')
const url = require('url')
const http = require('http')
const exec = require('child_process').exec
const yargs = require('yargs')

class CLI {
  constructor (args) {
    this.parseArguments(args)
    this.port = this.args.port || 1337
    this.image = { path: './extension/icon.png', type: 'image/png' }
    this.index = { path: './extension/index.html', type: 'text/html' }
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
      .option('extension-port', {
        alias: 'e',
        describe: 'Define a specific port to run the extension server on. Defaults to 9223.'
      })
      .parse(args)
  }

  parseURL (str) {
    let re = /\schrome-devtools[^\s]*|^chrome-devtools[^\s]*/gi
    let matches = str.match(re)
    return (matches) ? matches[0] : null
  }

  exec () {
    let args = this.args._.splice(2, this.args._.length).join(' ')
    this.child = exec(`node --inspect ${args}`, { shell: true })
    this.child.stdout.on('data', this.handle.bind(this))
    this.child.stderr.on('data', this.handle.bind(this))
    this.child.on('close', _ => process.exit())
    process.on('exit', _ => this.child.kill())
  }

  handle (data) {
    let link = this.parseURL(data)
    if (!this.caught && link && !this.args['no-prompt']) {
      opn(
        `http://localhost:${this.port}/?rawkit=${encodeURIComponent(link)}`,
        {
          app: [ this.browser ],
          wait: false
        }
      )
      .then(() => {})
      .catch((e) => {})
      this.caught = true
    }
    if (!this.args.silent) {
      process.stdout.write(data)
    }
  }

  start () {
    this.server = http.createServer()
    this.server.on('request', (req, res) => {
      let request = url.parse(req.url, true)
      let image = request.pathname.match(/\.(jpeg|jpg|png|gif)$/)
      let file = (image) ? this.image : this.index
      fs.readFile(file.path, (err, data) => {
        if (err) throw err
        res.writeHead(200, { 'Content-Type': file.type })
        res.end(data.toString())
      })
    }).listen(this.port)
  }
}

module.exports = (args) => {
  return new CLI(args)
}
