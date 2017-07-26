/* global describe, it */

/* TODO: finish arguments writing tests */

const net = require('net')
const stdin = require('bdd-stdin')
const expect = require('chai').expect
const casual = require('casual')
const Promise = require('bluebird')

const file = './server.js'
const rand = `\n ${casual.sentences(2)} \n`
const args = [0, 1, '--test', 'args', '--port', 5555, file]
const input = `${rand} chrome-devtools://test ${rand}`
const rawkit = require('../bin/cli')(args)

function checkPort (port, timeout = 150) {
  return new Promise((resolve, reject) => {
    let timer = setTimeout(() => {
      reject(new Error({ code: 500, msg: 'timeout' }))
      socket.end()
    }, timeout)
    let socket = net.createConnection(port, '127.0.0.1', () => {
      clearTimeout(timer)
      resolve()
      socket.end()
    })
    socket.on('error', (err) => {
      clearTimeout(timer)
      reject(err)
    })
  })
}

describe('rawkit', () => {
  it('should parse arguments', () => {

  })

  it('should start an extension server', () => {
    checkPort(5555, 500)
  })

  it('should start a node child process', () => {

  })

  it('should detect url', () => {
    expect(rawkit.args.test).to.equal('args')
  })

  it('should parse url', () => {
    expect(rawkit.args.test).to.equal('args')
  })

  it('should handle stdin', () => {
    stdin(input)
    expect(rawkit.args.test).to.equal('args')
  })
})
