/* global describe, it, beforeEach */

const rawkit = require('../bin/cli')
const expect = require('chai').expect
const file = './server.js'

describe('rawkit', () => {
  it('should parse arguments', () => {

  })

  it('should start an extension server', () => {

  })

  it('should start a node child process', () => {

  })

  it('should detect url', () => {

  })

  it('should parse url', () => {
    let r = rawkit(['--test', 'args'])
    expect(r.args.test).to.equal('args')
  })
})
