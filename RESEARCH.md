# Research

I did a bunch of research while looking for a solution to, what seemed like, a trivial problem. I stumbled upon some good resources on headless chrome along with other command-line flags that can be past to chrome when running it.

### How is this different then other Node.js Chrome debugging tools?

#### NiM
Shout out to ["Will"](https://june07.com) who made [NiM](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj?hl=en) (ie. *Node --inspector Manager*). Great project. NiM works by polling to see if new node debugging ports have opened to launch the inspector. That said, this is generally a slow & a bit clunky approach. Thus, I made this CLI tool to immediately open the developer tools when executed. Simple & fast.

#### nif
Shout out to [@thlorenz](https://github.com/thlorenz) who made [nif](https://github.com/thlorenz/nif). I utilize the same method of immediately opening Chrome through [@prasmussen](https://github.com/prasmussen)'s [chrome-cli](https://github.com/prasmussen/chrome-cli) tool. Again, **rawkit** goes a step further and has support for Windows & users that don't want to install a secondary shell script through the Chrome extension.

#### inspect-process
Shout out to [@jaridmargolin](https://github.com/) for making [inspect-process](https://github.com/jaridmargolin/inspect-process). Although very similar, it currently doesn't have support for both the new and legacy debugging APIs like **rawkit** does.

#### node-inspect
Shout out to the whole [node.js foundation](https://www.npmjs.com/~nodejs-foundation) & [@jkrems](https://github.com/jkrems) for writing this tool. Caveat here are the it's  barebones-ness and lack up up-to-date API support.

#### Chrome Launching Tools
- [lighthouse/chrome-launcher](https://github.com/GoogleChrome/lighthouse/tree/master/chrome-launcher)
- [chrome-cli](https://github.com/prasmussen/chrome-cli)
- [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver) + [chromedriver](https://www.npmjs.com/package/chromedriver)


### Launching Chrome from Terminal on Mac

```bash
$ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome ...
```

### Interesting command line flags for chrome:

- `--app`
- `--auto-open-devtools-for-tabs`
- `--allow-file-access-from-files`
- `--enable-devtools-experiments`
- `--enable-ui-devtools`
- `--remote-debugging-targets`
- `--isolate-extensions`
- `--disable-web-security`
- `--allow-file-access`
- `--app-shell-host-window-size=w,h`
- `--window-size=w,h`
- `--window-position=x,y`

### You can pass straight HTML to Chrome via `--app`

```bash
$ ... --app="data:text/html,<html><body><script>window.moveTo(0,0);window.resizeTo(800,600);</script></body></html>"
```

### Headless Chrome
Great article by Eric Bidelman here: https://developers.google.com/web/updates/2017/04/headless-chrome. Most notably, I found out that Lighthouse ships with a "chrome-launcher" (ie. `require('lighthouse/chrome-launcher/chrome-launcher')`) which has some nifty options as well.

### Redirection / Opening the DevTools panel
`window.location = 'chrome-devtools://...'` definitely doesn't work in the browser... you must open the dev tools panel (and any other chrome-specific url, like `chrome://flags`) using a Chrome Extension.

#### Keys to the Chrome Extension approach:
- Use `chrome.tabs.create({ url: '[insert chrome-specific link here]' })`
- Put the above **inside** a user/browser action/listener (ex. `chrome.tabs.onCreated.addListener()` or `chrome.browserAction.onClicked.addListener()`)

### Chrome CLI
An old approach to checking if someone had installed [chrome-cli](https://github.com/prasmussen/chrome-cli) which no longer supports dynamically opening the devtools/debugger window (unfortunately).

```js
const execSync = require('child_process').execSync
const spawn = require('child_process').spawn

if (exists('chrome-cli')) {
  let chrome = spawn('chrome-cli', [ 'open', ref ])
  execSync(`open -a "${this.chrome}"`)
  chrome.stdout.on('data', _ => {})
  chrome.stderr.on('data', _ => {})
  chrome.on('close', _ => {})
}

function exists (cmd) {
  try {
    let stdout = execSync(`command -v ${cmd} 2>/dev/null && { echo >&1 \'${cmd} found\'; exit 0; }`
    )
    return !!stdout
  } catch (error) {
    return false
  }
}
```
