# Research

I did a bunch of research while looking for a solution to, what seemed like, a trivial problem. I stumbled upon some good resources on headless chrome along with other command-line flags that can be past to chrome when running it.

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
