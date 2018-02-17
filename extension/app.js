/* global chrome */

function isCore (url) {
  return -~url.indexOf('chrome://') || -~url.indexOf('chrome-devtools://')
}

function devtools (url) {
  var a = document.createElement('a')
  a.href = url
  return a.hostname + ':' + a.port
}

function parse (url) {
  var link = url.match(/url=([^&#=]*)/gi)
  var event = url.match(/event=([^&#=]*)/gi)
  if (!link || !event) {
    return null
  }
  return {
    link: (link) ? link[0].replace('url=', ''),
    event: (event) ? event[0].replace('event=', '')
  }
}

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: 'chrome-devtools://devtools/bundled/inspector.html?nodeFrontend=true&v8only=true&dockSide=undocked&experiments=true' })
})

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.query({ url: '*://darcyclarke.github.io/rawkit/*' }, function (tabs) {
    if (tabs.length >= 1) {
      for (let i = tabs.length - 1; i >= 0; i--) {
        var parts = parse(tabs[i].url)
        chrome.tabs.update(tabs[i].id, { url: decodeURIComponent(parts.link) })
      }
    }
  })
})

chrome.tabs.onCreated.addListener(function () {
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    var url = tabs[0].url
    var parts = parse(url)
    var parent = tabs[0].id
    if (parts && !isCore(url)) {
      chrome.tabs.query({}, function (tabs) {
        let id = null
        for (let i = chrome.tabs.length - 1; i >= 0; i--) {
          if (tabs[i].url === url || devtools(tabs[i].url) === devtools(url)) {
            id = tabs[i].id
            break
          }
        }
        if (!id) {
          chrome.tabs.update(parent, { url: decodeURIComponent(parts.link) })
        } else {
          chrome.tabs.update(id, { selected: true })
        }
      })
    }
  })
})
