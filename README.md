[![npm version](https://badge.fury.io/js/rawkit.svg)](https://badge.fury.io/js/rawkit) [![Build Status](https://travis-ci.org/darcyclarke/rawkit.svg?branch=master)](https://travis-ci.org/darcyclarke/rawkit) [![Known Vulnerabilities](https://snyk.io/test/github/darcyclarke/rawkit/badge.svg)](https://snyk.io/test/github/darcyclarke/rawkit) [![Greenkeeper badge](https://badges.greenkeeper.io/darcyclarke/rawkit.svg)](https://greenkeeper.io/)

# rawkit

**rawkit** grabs the chrome inspector URL returned from the `node --inspect` command and immediately opens devtools. No more *clicking*, *selecting*, *copying*/*pasting* or *navigating*. Just run the command and jump into debugging.

### Installation

```bash
$ npm i rawkit -g
```

### Run

```bash
$ rawkit index.js
```

### Should this be in node core?
Probably. A flag like `--launch` would be a nice suppliment to `--inspect`. Maybe I'll make a PR one day.

### Interesting command line flags for chrome

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

#### Launch Chrome

```bash
$ /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome ...
```

#### You can also pass in straight HTML to `--app`

```bash
$ ... --app="data:text/html,<html><body><script>window.moveTo(0,0);window.resizeTo(800,600);</script></body></html>""
```
