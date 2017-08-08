[![npm version](https://badge.fury.io/js/rawkit.svg)](https://badge.fury.io/js/rawkit)
[![Build Status](https://travis-ci.org/darcyclarke/rawkit.svg?branch=master)](https://travis-ci.org/darcyclarke/rawkit)
[![Build status](https://ci.appveyor.com/api/projects/status/aypcyq2ry7jh8a1k?svg=true)](https://ci.appveyor.com/project/darcyclarke/rawkit)
[![Known Vulnerabilities](https://snyk.io/test/github/darcyclarke/rawkit/badge.svg)](https://snyk.io/test/github/darcyclarke/rawkit)
[![Dependency Status](https://david-dm.org/darcyclarke/rawkit/master.svg)](https://david-dm.org/darcyclarke/rawkit/master)
[![devDependency Status](https://david-dm.org/darcyclarke/rawkit/master/dev-status.svg)](https://david-dm.org/darcyclarke/rawkit/master?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/darcyclarke/rawkit.svg)](https://greenkeeper.io/)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

<img src="https://cloud.githubusercontent.com/assets/459713/26273839/960e60d2-3d07-11e7-9ed1-e50f411a473f.png" width="360px" alt="rawkit">

**rawkit** grabs the chrome inspector URL returned from the `node --inspect` command and immediately opens devtools. No more *clicking*, *selecting*, *copying*/*pasting* or *navigating*. Just run the command and jump into debugging.

### Installation

```bash
$ npm i rawkit -g
```

### Run

```bash
$ rawkit index.js
```

![rawkit](https://user-images.githubusercontent.com/459713/29084045-d01c953a-7c38-11e7-9711-a2875d81f1c1.gif)

## Options

### `--inspect-brk` alias `brk`

To break on the first line of the application code.

### `--extension=[port]` alias `e`

Define a specific port to run the extension server on. Defaults to 1337.

### `--silent` alias `s`

Hide stdout/stderr output from child process in the terminal window.

### `--canary` alias `c`

Open the devtools in canary.

## FAQ

### Should this be in node core?
*Maybe*. A flag like `--launch` would be a nice suppliment to `--inspect`. That said...

*Opening internal Chrome links, externally, is not possible at the moment (ie. `chrome://` or `chrome-devtools://` in this case). This is most likely a security feature. That said, you can use a Chrome Extension as a proxy to make this work. Check out the [RESEARCH.md](https://github.com/darcyclarke/rawkit/blob/master/RESEARCH.md) for more information.*

### How is this different then other Node.js Chrome debugging tools?

Shout out to ["Will"](https://june07.com) who made [NiM](https://chrome.google.com/webstore/detail/nodejs-v8-inspector-manag/gnhhdgbaldcilmgcpfddgdbkhjohddkj?hl=en) (ie. *Node --inspector Manager*). Great project. NiM works by polling to see if new node debugging ports have opened to launch the inspector. That said, this is generally a slow & a bit clunky approach. Thus, I made this CLI tool to immediately open the developer tools when executed. Simple & fast.
