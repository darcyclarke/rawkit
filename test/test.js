/* global describe, it */

import rawkit from '../bin/cli'
import { expect } from 'chai'

describe('rawkit', () => {
  it('should exist', () => {
    expect(rawkit).to.not.equal(null)
  })
})
