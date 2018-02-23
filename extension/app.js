/* global chrome */

function isCore (url) {
  return -~url.indexOf('chrome://') || -~url.indexOf('chrome-devtools://')
}

function isRawkit (url) {
  return -~url.indexOf('darcyclarke.github.io/rawkit/')
}

function devtools (url) {
  var a = document.createElement('a')
  a.href = url
  return a.hostname + ':' + a.port
}

function sibling (url) {
  var id = null
  var decoded = decodeURIComponent(url)
  var ws = decoded.match(/ws=([^&#=]*)/gi)
  for (var i = chrome.tabs.length - 1; i >= 0; i--) {
    var wsExists = isCore(tabs[i].url) && devtools(tabs[i].url) === devtools(ws)
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

function parse (url) {
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

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: 'chrome-devtools://devtools/bundled/inspector.html?nodeFrontend=true&v8only=true&dockSide=undocked&experiments=true' })
})

chrome.runtime.onInstalled.addListener(function () {
  chrome.tabs.query({ url: '*://darcyclarke.github.io/rawkit/*' }, function (tabs) {
    if (tabs.length >= 1) {
      for (var i = tabs.length - 1; i >= 0; i--) {
        var parts = parse(tabs[i].url)
        chrome.tabs.update(tabs[i].id, { url: decodeURIComponent(parts.link), active: true })
        break
      }
    }
  })
})

chrome.tabs.onCreated.addListener(function () {
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
    var origin = tabs[0]
    var url = origin.url
    var parts = parse(url)
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
          chrome.tabs.remove(origin.id, function() {})
        } else if (parts.event === 'start') {
          chrome.tabs.update(origin.id, options)
        }
      })
    }
  })
})
