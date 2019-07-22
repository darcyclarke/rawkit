const fs = require('fs')
const path = require('path')
const archiver = require('archiver')
const version = require('../extension/manifest.json').version
const file = path.resolve(__dirname, `../dist/extension-${version}.zip`)

const output = fs.createWriteStream(file)
const archive = archiver('zip', {
  zlib: { level: 9 }
})

output.on('close', () => {
  console.log(`${file} - Successfully created - Total bytes: ${archive.pointer()}`)
})

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
  } else {
    throw err
  }
})

archive.on('error', (err) => {
  throw err
})

archive.pipe(output)
archive.directory(path.resolve(__dirname, '../extension/'), false)
archive.finalize()
