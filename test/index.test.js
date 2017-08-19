/* global describe, it */

const expect = require('chai').expect
const args = process.argv
const rawkit = require('../bin/cli')(args)

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

  it('should handle arguments', () => {
    expect(rawkit.args.test).to.equal('args')
  })
})
