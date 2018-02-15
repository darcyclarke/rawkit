'use strict'

const fs = require('fs')
const opn = require('opn')
const path = require('path')
const exec = require('child_process').exec
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
const yargs = require('yargs')
const compare = require('semver-compare')

class CLI {
  constructor (args) {
    this.args = this.parseArguments(args)
    this.prefix = 'ws://'
    this.chrome = '/Applications/Google Chrome.app'
    this.devtools = 'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws='
    this.image = { path: '../extension/icon.png', type: 'image/png' }
    this.index = { path: '../extension/index.html', type: 'text/html' }
    this.caught = false
    this.browser = `${this.args.executable} ${this.args.canary ? 'canary' : ''}`.trim()
    this.errors = {
      process: 'Error: You must define a path to a node process directly or within your package.json under "main"',
      nodemon: 'Error: nodemon is not installed'
    }
  }

  get props () {
    return {
      args: this.args,
      browser: this.browser
    }
  }

  parseArguments (args) {
    let ret = yargs
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
      .option('executable', {
        alias: 'e',
        describe: 'Specify the name of the executable.',
        default: 'google chrome'
      })
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
      .parse(args)
    return ret
  }

  parseURL (str) {
    let re = /(\b(ws?|chrome-devtools):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
    let matches = str.match(re)
    let link = (matches) ? matches[0] : null
    let isNew = link && link.indexOf(this.prefix) >= 0
    return (isNew) ? `${this.devtools}${link.replace(this.prefix, '')}` : link
  }

  exists (cmd) {
    try {
      let stdout = execSync(`command -v ${cmd} 2>/dev/null && { echo >&1 \'${cmd} found\'; exit 0; }`
      )
      return !!stdout
    } catch (error) {
      return false
    }
  }

  path (path) {
    path = path | this.pkg(process.cwd())
    path = (path && fs.lstatSync(path).isDirectory()) ? this.pkg(path) : path
    if (path && fs.lstatSync(path).isFile()) {
      return path
    }
    console.error(this.errors.process)
    process.exit()
  }

  pkg (dir) {
    let file = path.relative(dir, 'package.json')
    if (fs.existsSync(file)) {
      let config = JSON.parse(fs.readFileSync(file, 'utf8'))
      if (config.main) {
        return path.resolve(process.cwd(), config.main)
      }
    }
    console.error(this.errors.process)
    process.exit()
  }

  nodemon (dir) {
    let file = path.relative(dir, 'nodemon.json')
    let cmd = 'nodemon'
    if (!this.exists('nodemon')) {
      console.error(this.errors.nodemon)
      process.exit()
    }
    if (fs.existsSync(path)) {
      let config = JSON.parse(fs.readFileSync(file, 'utf8'))
      return (config && config.execMap) ? config.execMap.js : cmd
    }
    return cmd
  }

  exec () {
    let path = this.path(this.args._[2])
    let o = process.argv
    let legacy = (compare(process.version, '8.0.0') === -1)
    let brk = (legacy) ? 'debug-brk' : 'inspect-brk'
    let cmd = (this.args.brk) ? brk : 'inspect'
    let args = o.splice(o.indexOf(path), o.length).join(' ').replace(path, '')
    let binary = (this.args.nodemon) ? this.nodemon(process.cwd()) : 'node'
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
      if (this.exists('chrome-cli')) {
        let chrome = spawn('chrome-cli', [ 'open', ref ])
        execSync(`open -a "${this.chrome}"`)
        chrome.stdout.on('data', _ => {})
        chrome.stderr.on('data', _ => {})
        chrome.on('close', _ => {})
      } else {
        let link = `https://darcyclarke.github.io/rawkit/?rawkit=${encodeURIComponent(ref)}`
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
}

module.exports = (args) => {
  return new CLI(args)
}
