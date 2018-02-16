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

## Installation

```bash
$ npm i rawkit -g
```
or
```bash
$ yarn global add rawkit
```

## Run

```bash
$ rawkit example.js
```
or utilizing [`npx`](https://www.npmjs.com/package/npx)
```bash
$ npx rawkit example.js
```

<img src="https://user-images.githubusercontent.com/459713/29084045-d01c953a-7c38-11e7-9711-a2875d81f1c1.gif" width="100%" alt="tutorial">

## Features

- ✅ Works offline
- ✅ Supports Mac, Windows & Linux
- ✅ Support for `nodemon`
- ✅ Supports legacy node `v4.x` & `v6.x` implementations & debugging protocols
- ✅ Supports legacy Chrome devtools implementations & debugging protocols

## Options

By default, running `rawkit` can detect any `main` script that's been defined in the current working directory's `package.json` and run that. It also will detect the version of Node.js you're running to determine whether or not to fallback to older `debug` APIs.

#### `--inspect-brk` alias `brk`

To break on the first line of the application code.

```bash
$ rawkit example.js --inspect-brk
```

#### `--inspect-port` alias `p`

The debugger port. Defaults to 9229.

```bash
$ rawkit example.js --inspect-port=1337
```

#### `--canary` alias `c`

Open the devtools in canary.

```bash
$ rawkit example.js --canary
```

#### `--nodemon` alias `nm`

Use [`nodemon`](https://github.com/remy/nodemon) to run/watch your node process & reload when files change. **rawkit** supports all the default configuration options for `nodemon` including `execMap` inside our project's `package.json` or `nodemon.json` files.

**Example**
```bash
$ rawkit example.js --nodemon
```

#### `--silent` alias `s`

Hide stdout/stderr output from child process in the terminal window.

#### `--executable=[name]` alias `e`

Specify the name of the executable. Defaults to `google chrome`.

> **Note:** `--executable` is an experimental feature as rawkit typically does all the work to determine the right executable to use based on your operating system and any other arguments or environmental configuration.

## FAQ

### Chrome opens to a blank page?
You may have some issues if your version of Chrome has recently updated and it and/or your OS hasn't be restarted. Quick fix here is to just try restarting Chrome and/or restarting your machine. This was identified in the [`opn`](https://github.com/sindresorhus/opn/issues/83) project.

### Should this be in node core?
*Maybe*. A flag like `--launch` would be a nice supplement to `--inspect`. That said...

### Do I need to install a Chrome Extension?

**rawkit** will automatically launch a splash page asking you to install a corresponding Chrome Extension the first time you run it. If you don't want to install the extension, and are on a Mac, you can install [chrome-cli](https://github.com/prasmussen/chrome-cli) to get around this. **rawkit** will automatically detect if `chrome-cli` exists on your machine and use that to open/launch chrome once it's installed.

```bash
$ brew install chrome-cli
```

*Unfortunately, opening internal Chrome links, externally, is not possible without an aid at the moment (ie. urls that contain `chrome://` or `chrome-devtools://` in this case). This is most likely a security feature. That said, you can use a Chrome Extension as a proxy to make this work. Check out the [RESEARCH.md](https://github.com/darcyclarke/rawkit/blob/master/RESEARCH.md) for more information. You can also use something like this [lighthouse/chrome-launcher](https://github.com/GoogleChrome/lighthouse/tree/master/chrome-launcher).*
