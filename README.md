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

### Don't want to install the Chrome Extension?

**Homebrew install [chrome-cli](https://github.com/prasmussen/chrome-cli)**

```bash
$ brew install chrome-cli
```

**rawkit** will automatically detect `chrome-cli` and use it over prompting to use the Chrome Extension. Unfortunately, Windows users will still have to go through that first option.

<img src="https://user-images.githubusercontent.com/459713/29084045-d01c953a-7c38-11e7-9711-a2875d81f1c1.gif" width="100%" alt="tutorial">

## Options

By default, running `rawkit` can detect any `main` script that's been defined in the current working directory's `package.json` and run that. It also will detect the version of Node.js you're running to determine whether or not to fallback to older `debug` APIs.

### `--inspect-brk` alias `brk`

To break on the first line of the application code.

### `--inspect-port` alias `p`

The debugger port. Defaults to 9229.

### `--executable=[name]` alias `e`

Specify the name of the executable. Defaults to `google chrome`.

### `--silent` alias `s`

Hide stdout/stderr output from child process in the terminal window.

### `--canary` alias `c`

Open the devtools in canary.

## FAQ

### Should this be in node core?
*Maybe*. A flag like `--launch` would be a nice supplement to `--inspect`. That said...

*Opening internal Chrome links, externally, is not possible at the moment (ie. `chrome://` or `chrome-devtools://` in this case). This is most likely a security feature. That said, you can use a Chrome Extension as a proxy to make this work. Check out the [RESEARCH.md](https://github.com/darcyclarke/rawkit/blob/master/RESEARCH.md) for more information. You can also use something like this [lighthouse/chrome-launcher](https://github.com/GoogleChrome/lighthouse/tree/master/chrome-launcher).*
