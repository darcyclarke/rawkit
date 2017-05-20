[![npm version](https://badge.fury.io/js/rawkit.svg)](https://badge.fury.io/js/rawkit) [![Build Status](https://travis-ci.org/darcyclarke/rawkit.svg?branch=master)](https://travis-ci.org/darcyclarke/rawkit) [![Known Vulnerabilities](https://snyk.io/test/github/darcyclarke/rawkit/badge.svg)](https://snyk.io/test/github/darcyclarke/rawkit) [![Greenkeeper badge](https://badges.greenkeeper.io/darcyclarke/rawkit.svg)](https://greenkeeper.io/)

![mark](https://cloud.githubusercontent.com/assets/459713/26273839/960e60d2-3d07-11e7-9ed1-e50f411a473f.png =360x)

**rawkit** grabs the chrome inspector URL returned from the `node --inspect` command and immediately opens devtools. No more *clicking*, *selecting*, *copying*/*pasting* or *navigating*. Just run the command and jump into debugging.

### Installation

```bash
$ npm i rawkit -g
```

### Run

```bash
$ rawkit index.js
```

## Options

### `--port=[num]`

The only option at the moment, you can set the *port* the extension proxy server lives. Example: `$ rawkit --port=1337 server.js`.

## FAQ

### "Should this be in node core?"
Probably. A flag like `--launch` would be a nice suppliment to `--inspect`. ~~Maybe I'll make a PR one day~~.

*Update: opening internal chrome links externally is no walk in the park (ie. `chrome://` or `chrome-devtools://` in this specific case). I might write a blog post about the different ways I looked at how to solve this, what I learned, and the general nitty gritty of what should have been a straightforward problem to solve.*

### "How is this different then the competitors?"

First off, big shout out to ["Will"](https://june07.com) who made [NiM](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj?hl=en) (ie. Node --inspector Manager). Great project, some cool options and it seems to work pretty well. I think the only criticism I have is that NiM works by polling to see if new ports have opened to launch the inspector (not very effecient). Also, it's a Chrome Extension; That said, this may be something we can't avoid (*I'll be writing an article about this at some point*).

**rawkit** is probably closest to NiM in that it works with the native (although semi-experimental) `node --inspect` feature. I reminice over the days of [node-inspector](https://www.npmjs.com/package/node-inspector), [node-debugger](https://atom.io/packages/node-debugger), [devtool](https://www.npmjs.com/package/devtool) and even [nodemon](https://www.npmjs.com/package/nodemon), to some extent, as they've fallen out of my daily usage. That said, `--inspect` alone isn't going to cut the cheese. **rawkit** gets us back to a simple and straightforward workflow. Less options. More command line. Faster path to the developer tools you know and love.

`rawkit server.js`

## Discovery

#### Interesting command line flags for chrome:

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

#### Launching Chrome from Terminal on Mac

```bash
$ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome ...
```

#### You can pass straight HTML to Chrome via `--app`

```bash
$ ... --app="data:text/html,<html><body><script>window.moveTo(0,0);window.resizeTo(800,600);</script></body></html>"
```
