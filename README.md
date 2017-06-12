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

## [Currently In-Development]

Proof-of-concept is working, polish, tests and some other tweaks should be ready soon. Clone, fork or install at your own risk.

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
