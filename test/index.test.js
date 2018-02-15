/* global describe, it */

const path = require('path')
const expect = require('chai').expect
const args = [process.argv[0], path.resolve(__dirname, '../index.js'), path.resolve(__dirname, './server.js'), '--test=args']
const CLI = require('../bin/cli')
const rawkit = CLI(args)

describe('rawkit', () => {
  // TODO:
  // - should parse arguments
  // - should handle custom executable
  // - should handle canary
  // - should handle nodemon
  // - should handle reload/restart
  // - should handle inspect-brk
  // - should handle inspect-port
  // - should handle stdin stdin(input)
  // - should detect url
  // - should parse url
  // - should start a child process

  it('should exist', () => {
    expect(typeof rawkit).to.equal('object')
  })

  it('should handle arguments', () => {
    expect(rawkit.args.test).to.equal('args')
  })
})
