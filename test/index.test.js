/* global describe, it */

/* TODO: finish arguments writing tests */

const expect = require('chai').expect
const casual = require('casual')
const stdin = require('bdd-stdin')
const file = './server.js'
const rand = `\n ${casual.sentences(2)} \n`
const input = `${rand} chrome-devtools://test ${rand}`
let rawkit = require('../bin/cli')(['--test', 'args', file])

describe('rawkit', () => {
  it('should parse arguments', () => {

  })

  it('should start an extension server', () => {

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
