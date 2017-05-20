/* global chrome */

console.log('hello world!')
chrome.tabs.onCreated.addListener(function () {
  console.log('created a new tab!')
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    var url = tabs[0].url
    var isCore = -~url.indexOf('chrome://') || -~url.indexOf('chrome-devtools://')
    var isKit = -~url.indexOf('?rawkit=')
    var matches = /param1=([^&#=]*)/.exec(url)
    var inspect = matches[1]
    console.log('url', url)
    if (isKit && !isCore && inspect) {
      console.log('wooot! devtools', inspect)
      // chrome.tabs.create({ url: document.querySelector('a').href })
    }
  })
})

window.addEventListener('load', function () {
})
