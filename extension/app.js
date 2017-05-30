/* global chrome, InspectorFrontendHost */

console.log('listening...')

function isCore (url) {
  return -~url.indexOf('chrome://') || -~url.indexOf('chrome-devtools://')
}

function parse (url) {
  var matches = url.match(/rawkit=([^&#=]*)/gi)
  return (matches) ? matches[0].replace('rawkit=', '') : null
}

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: 'chrome-devtools://devtools/bundled/inspector.html?nodeFrontend=true&v8only=true&dockSide=undocked&experiments=true' })
})

chrome.tabs.onCreated.addListener(function () {
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    var url = tabs[0].url
    var link = parse(url)
    var parent = tabs[0].id
    if (!isCore(url) && link) {
      chrome.tabs.query({}, function (tabs) {
        let id = null
        for (let i = chrome.tabs.length - 1; i >= 0; i--) {
          if (tabs[i].url === url) {
            id = tabs[i].id
            break
          }
        }
        if (!id) {
          chrome.tabs.create({ url: decodeURIComponent(link) })
        } else {
          chrome.tabs.update(id, {selected: true})
        }
        chrome.tabs.remove(parent)
      })
    }
  })
})

window.addEventListener('load', function () {
})
