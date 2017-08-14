'use strict'

const fs = require('fs')
const opn = require('opn')
const url = require('url')
const path = require('path')
const http = require('http')
const exec = require('child_process').exec
const yargs = require('yargs')
const shell = require('shelljs')
const compare = require('semver-compare')

class CLI {
  constructor (args) {
    this.parseArguments(args)
    this.port = this.args.extension || 1337
    this.prefix = 'ws://'
    this.chrome = '/Applications/Google Chrome.app'
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
      .option('nodemon', {
        alias: 'nm',
        describe: 'Use nodemon to automatically reload your application .',
        boolean: true
      })
      .option('inspect-brk', {
        alias: 'brk',
        describe: 'To break on the first line of the application code.',
        boolean: true
      })
      .option('inspect-port', {
        alias: 'p',
        describe: 'The debugger port. Defaults to 9229.',
        type: 'number'
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
    let re = /(\b(ws?|chrome-devtools):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    let matches = str.match(re)
    let link = (matches) ? matches[0] : null
    let isNew = link && link.indexOf(this.prefix) >= 0
    return (isNew) ? `${this.devtools}${link.replace(this.prefix, '')}` : link
  }

  path () {
    let path = 'package.json'
    if (fs.existsSync(path)) {
      let config = JSON.parse(fs.readFileSync(path, 'utf8'))
      if (config.main) {
        return config.main
      }
    }
    throw Error(`You must define a path to a node process directly or within your package.json under 'main'`)
  }

  nodemon () {
    let path = 'nodemon.json'
    let cmd = 'nodemon'
    if (!shell.which('nodemon')) {
      throw new Error('nodemon is not installed')
    }
    if (fs.existsSync(path)) {
      let config = JSON.parse(fs.readFileSync(path, 'utf8'))
      return (config && config.execMap) ? config.execMap.js : cmd
    }
    return cmd
  }

  exec () {
    let path = (this.args._.length > 2) ? this.args._[2] : this.path()
    let o = process.argv
    let legacy = (compare(process.version, '8.0.0') === -1)
    let brk = (legacy) ? 'debug-brk' : 'inspect-brk'
    let cmd = (this.args.brk) ? brk : 'inspect'
    let args = o.splice(o.indexOf(path), o.length).join(' ').replace(path, '')
    let binary = (this.args.nodemon) ? this.nodemon() : 'node'
    if (this.args.inspectPort) {
      let flag = (legacy) ? 'debug' : 'inspect-port'
      cmd += ` --${flag}=${this.args.inspectPort}`
    }
    this.child = exec(`${binary} --${cmd} ${args}`, { shell: true })
    this.child.stdout.on('data', this.handle.bind(this))
    this.child.stderr.on('data', this.handle.bind(this))
    this.child.on('close', _ => process.exit())
    process.on('exit', _ => this.child.kill())
  }

  handle (data) {
    let ref = this.parseURL(data)
    if (!this.caught && ref && !this.args['no-prompt']) {
      this.caught = true
      if (shell.which('chrome-cli')) {
        exec(`chrome-cli open ${ref}; open -a "${this.chrome}"`, { shell: true })
      } else {
        let link = `http://localhost:${this.port}/?rawkit=${encodeURIComponent(ref)}`
        let opts = {
          app: [this.browser],
          wait: false
        }
        opn(link, opts)
          .then(() => {})
          .catch((e) => {})
      }
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
      let request = url.parse(req.url, true)
      let image = request.pathname.indexOf('.png') >= 0
      let file = (image) ? this.image : this.index
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
