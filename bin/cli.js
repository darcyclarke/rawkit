'use strict'

const fs = require('fs')
const opn = require('opn')
const path = require('path')
const exec = require('child_process').exec
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn
const yargs = require('yargs')
const getos = require('getos')
const semver = require('semver')
const version = require('../package').version

class CLI {
  constructor (args) {
    this.args = this.parseArguments(args)
    this.options = /^(executable|canary|inspect-port|inspect-brk|silent|nodemon)$/
    this.prefix = 'ws://'
    this.devtools = 'chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws='
    this.image = { path: '../extension/icon.png', type: 'image/png' }
    this.index = { path: '../extension/index.html', type: 'text/html' }
    this.caught = false
    this.errors = {
      process: 'Error: You must define a path to a node process directly or within your package.json under "main"',
      nodemon: 'Error: nodemon is not installed'
    }
  }

  get props () {
    return {
      args: this.args
    }
  }

  parseArguments (args) {
    return yargs
      .version()
      .demandCommand(1)
      .usage('rawkit [options] <file ...>')
      .alias('v', 'version')
      .version(version)
      .describe('v', 'show version information')
      .alias('h', 'help')
      .help('help')
      .usage('Usage: $0 -x [num]')
      .showHelpOnFail(false, 'Specify --help for available options')
      .option('executable', {
        describe: 'Specify the name of the executable.',
        default: 'google chrome'
      })
      .option('canary', {
        describe: 'Run the devtools in canary.',
        boolean: true
      })
      .option('nodemon', {
        describe: 'Use nodemon to automatically reload your application.',
        boolean: true
      })
      .option('inspect-brk', {
        describe: 'To break on the first line of the application code.',
        boolean: true
      })
      .option('inspect-port', {
        describe: 'The debugger port. Defaults to 9229.',
        type: 'number'
      })
      .option('silent', {
        describe: 'Hide stdout/stderr output from child process.',
        boolean: true
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

  exists (cmd) {
    try {
      const stdout = execSync(`command -v ${cmd} 2>/dev/null && { echo >&1 \'${cmd} found\'; exit 0; }`
      )
      return !!stdout
    } catch (error) {
      return false
    }
  }

  file (location) {
    location = location || this.pkg(process.cwd())
    location = (location && fs.lstatSync(location).isDirectory()) ? this.pkg(location) : location
    if (location && fs.lstatSync(location).isFile()) {
      return location
    }
    console.error(this.errors.process)
    process.exit()
  }

  pkg (location) {
    const file = path.relative(location, 'package.json')
    if (fs.existsSync(file)) {
      const config = JSON.parse(fs.readFileSync(file, 'utf8'))
      if (config.main) {
        return path.resolve(process.cwd(), config.main)
      }
    }
    console.error(this.errors.process)
    process.exit()
  }

  nodemon (location) {
    const file = path.relative(location, 'nodemon.json')
    const cmd = 'nodemon'
    if (!this.exists('nodemon')) {
      console.error(this.errors.nodemon)
      process.exit()
    }
    if (fs.existsSync(file)) {
      const config = JSON.parse(fs.readFileSync(file, 'utf8'))
      return (config && config.execMap) ? config.execMap.js : cmd
    }
    return cmd
  }

  exec () {
    const file = this.file(this.args._[2])
    const o = process.argv
    const legacy = semver.lt(semver.coerce(process.version), '8.0.0')
    const brk = (legacy) ? 'debug-brk' : 'inspect-brk'
    let cmd = (this.args.brk) ? brk : 'inspect'
    let args = o.splice(o.indexOf(file), o.length).join(' ').replace(file, '')
    args = args.split(' ').filter((v) => v.match(this.options)).join(' ')
    const binary = (this.args.nodemon) ? this.nodemon(process.cwd()) : 'node'
    if (this.args.inspectPort) {
      const flag = (legacy) ? 'debug' : 'inspect-port'
      cmd += ` --${flag}=${this.args.inspectPort}`
    }
    this.child = exec(`${binary} --${cmd} ${file} ${args}`, { shell: true })
    this.child.stdout.on('data', this.handle.bind(this))
    this.child.stderr.on('data', this.handle.bind(this))
    this.child.on('close', _ => process.exit())
    process.on('exit', _ => this.child.kill())
  }

  handle (data) {
    const ref = this.parseURL(data)
    if (ref && !this.args['no-prompt']) {
      const event = !this.caught ? 'start' : 'reload'
      if (!this.caught) {
        this.caught = true
      }
      getos((e, data) => {
        const link = `https://darcyclarke.github.io/rawkit/?url=${encodeURIComponent(ref)}&event=${event}`
        if (!e) {
          if (data.os === 'win32') {
            this.args.executable = 'chrome'
          }
          if (data.os === 'linux') {
            this.args.executable = 'google-chrome'
          }
          if (data.os === 'darwin' && this.args.canary) {
            this.args.executable = 'google chrome canary'
          }
        }
        if (this.exists('chrome-cli')) {
          const chrome = spawn('chrome-cli', ['open', ref])
          execSync(`open -a "/Applications/Google Chrome${this.args.canary ? ' Canary' : ''}.app"`)
          chrome.stdout.on('data', _ => {})
          chrome.stderr.on('data', _ => {})
          chrome.on('close', _ => {})
        } else {
          const opts = {
            app: this.args.executable,
            wait: false
          }
          opn(link, opts)
            .then(() => {})
            .catch((e) => {})
        }
        if (!this.args.silent) {
          console.log('\x1b[33m%s\x1b[0m', 'Devtools URL:', ref)
        }
      })
    } else if (!this.args.silent) {
      process.stdout.write(data)
    }
  }
}

module.exports = (args) => {
  return new CLI(args)
}
