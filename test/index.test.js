/* global describe, it */

const expect = require('chai').expect
const args = process.argv
const rawkit = require('../bin/cli')(args)

describe('rawkit', () => {
  // TODO:
  // - should parse arguments
  // - should start a node child process
  // - should start extension server
  // - should detect url
  // - should parse url
  // - should handle stdin stdin(input)

  it('should handle arguments', () => {
    expect(rawkit.args.test).to.equal('args')
  })
})
