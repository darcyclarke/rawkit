/* global chrome */

console.log('listening...')

function isCore (url) {
  return -~url.indexOf('chrome://') || -~url.indexOf('chrome-devtools://')
}

function parse (url) {
  var matches = url.match(/rawkit=([^&#=]*)/gi)
  return (matches) ? matches[0].replace('rawkit=', '') : null
}

chrome.tabs.onCreated.addListener(function () {
  console.log('created a new tab!')
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    var url = tabs[0].url
    var link = parse(url)
    var parent = tabs[0].id
    console.log('url', url)
    if (!isCore(url) && link) {
      console.log('wooot! devtools', decodeURIComponent(link))
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
