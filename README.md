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
