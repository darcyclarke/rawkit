{
  const opn = require('opn')
  const exec = require('child_process').exec

  let args = process.argv.splice(2, process.argv.length).join(' ')
  let cmd = `node --inspect ${args}`
  let child = exec(cmd, { shell: true })
  let search = true

  function parse (str) {
    let re = /\schrome-devtools[^\s]*|^chrome-devtools[^\s]*/gi
    let matches = str.match(re)
    return (matches) ? matches[0] : null
  }

  function handle (data) {
    let link = parse(data)
    if (search && link) {
      console.log('FOUND!', link)

      // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome "data:text/html,<html><body><script>window.moveTo(0,0);window.resizeTo(800,600);</script></body></html>" --allow-file-access-from-files --disable-web-security --allow-file-access --new-window
      // --app="data:text/html,<html><body><script>window.moveTo(0,0);window.resizeTo(800,600);window.location='http://darcyclarke.me';</script></body></html>"
      // --auto-open-devtools-for-tabs
      // --allow-file-access-from-files
      // --enable-devtools-experiments
      // --enable-ui-devtools
      // --remote-debugging-targets
      // --isolate-extensions
      // --disable-web-security
      // --allow-file-access
      // --app-shell-host-window-size=WxH
      // --window-size=W,H
      // --window-position=x,y

      console.log(`LINKS: https://google.com/?rawkit=${encodeURIComponent(link)}`)
      opn(`https://google.com/?rawkit=${encodeURIComponent(link)}`, { app: ['google chrome canary'], wait: false }).then(() => {
        console.log('opened!')
      })
      search = false
    }
    process.stdout.write(data)
  }

  child.stdout.on('data', handle)

  child.stderr.on('data', handle)

  child.on('close', () => {
    process.exit()
  })

  process.on('exit', () => {
    child.kill()
  })
}
