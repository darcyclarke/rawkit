/* global chrome, navigator */

const prop = (p, o) => p.reduce((xs, x) => (xs && xs[x]) ? xs[x] : null, o)
const store = (chrome && !!prop(['storage', 'local'], chrome)) ? chrome.storage.local : browser.storage.local
const timeout = 500
const id = `poapmlldjpcgenaedpopfjjagnihpkim`
const home = `chrome.google.com/webstore/detail/rawkit/${id}/`
const install = 'darcyclarke.github.io/rawkit/'
const launch = `chrome-extension://${id}/launch.html`
const devtools = 'chrome-devtools://devtools/bundled/inspector.html?nodeFrontend=true&v8only=true&dockSide=undocked&experiments=true'
var instances = []

function isCore(url) {
  return -~url.indexOf('chrome://') || -~url.indexOf('chrome-devtools://')
}

function isRawkit(url) {
  return -~url.indexOf(install)
}

function getLocation(url) {
  var a = document.createElement('a')
  a.href = url
  return a.hostname + ':' + a.port
}

function sibling(url) {
  var id = null
  var decoded = decodeURIComponent(url)
  var ws = decoded.match(/ws=([^&#=]*)/gi)
  var tabs = chrome.tabs
  for (var i = tabs.length - 1; i >= 0; i--) {
    var wsExists = isCore(tabs[i].url) && getLocation(tabs[i].url) === getLocation(ws)
    if (tabs[i].url === url || wsExists) {
      id = {
        id: tabs[i].id,
        ws: wsExists
      }
      break
    }
  }
  return id
}

// Update badge
function updateBadge (instances) {
  chrome.browserAction.setBadgeBackgroundColor('#000000')
  const text = (instances.length > 1) ? data.instances.length : ''
  chrome.browserAction.setBadgeText({text: text})
}

// Update popup
function updatePopup (instances) {
  const popup = (instances.length > 1) ? 'popup.html' : ''
  chrome.browserAction.setPopup({popup: popup})
}

// Check if an instance has died
function updateInstances() {
  store.get(['instances'], (data) => {
    if (data.instances && typeof data.instances === 'array') {
      data.instances.forEach((instance) => {

      })
    }
    setTimeout(updateInstances, timeout)
  })
}

// Find launch pages & redirect them to devtools
function redirectLaunchPages(installed) {
  const url = (installed) ? launch : `*://${install}*`
  chrome.tabs.query({ url: url }, function (tabs) {
    if (tabs.length >= 1) {
      tabs.forEach((tab) => {
        var parts = parse(tab.url)
        chrome.tabs.update(tab.id, { url: decodeURIComponent(parts.link), active: true })
      })
    }
  })
}

// Parse a url returning link + event
function parse(url) {
  var link = url.match(/url=([^&#=]*)/gi)
  var event = url.match(/event=([^&#=]*)/gi)
  if (!link || !event) {
    return null
  }
  return {
    link: (link) ? link[0].replace('url=', '') : null,
    event: (event) ? event[0].replace('event=', '') : null
  }
}

// When extension is clicked
chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: devtools })
})

// On Extension Installation
chrome.runtime.onInstalled.addListener(function () {
  updateInstances()
})

chrome.tabs.onCreated.addListener(function () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    var origin = tabs[0]
    var url = origin.url
    var parts = parse(url)
    chrome.tabs.executeScript(origin.id, { file: 'require.js', allTabs: true })
    if (isRawkit(url) && !isCore(url) && parts) {
      chrome.tabs.query({}, function (tabs) {
        var tab = sibling(url)
        var options = {
          url: decodeURIComponent(parts.link)
        }
        if (tab && parts.event === 'reload') {
          // if (tab.wsExists) {
          //   options.active = true
          // }
          chrome.tabs.update(tab.id, options)
          chrome.tabs.remove(origin.id, function () {})
        } else if (parts.event === 'start') {
          chrome.tabs.update(origin.id, options)
        }
      })
    }
  })
})
