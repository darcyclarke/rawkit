#!/usr/bin/env node
'use strict'
const cli = require('./bin/cli.js')(process.argv)
cli.start()
cli.exec()
