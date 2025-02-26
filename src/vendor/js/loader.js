document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('loaded')
})

try {/*
 updatemybrowser.org JavaScript Library v1
 http://updatemybrowser.org/

 Copyright 2015, Joram van den Boezem
 Licensed under the GPL Version 3 license.
 http://www.gnu.org/licenses/gpl.html

 Based on Browser detect script by Peter-Paul Koch
 See http://www.quirksmode.org/js/detect.html
 Require UMB.Detect
 Require UMB.Browsers
 updatemybrowser.org JavaScript Library v1
 http://updatemybrowser.org/

 Copyright 2012, Joram van den Boezem
 Licensed under the GPL Version 3 license.
 http://www.gnu.org/licenses/gpl.html

 Require UMB.Status
*/
  var UMB = function () {
    function c (f, a, e) {
      e = e || 0
      for (var l in f) {
        try {
          f[l] = a[l].constructor === Object ? c(f[l], a[l], e + 1) : a[l]
        }
        catch (d) {}
      }
      return f
    }

    var a = !1, h = {}, e = function () {
      if (!a) {
        a = !0
        UMB.Detect.init()
        var f = window._umb || {}
        h = {
          require: {
            chrome: UMB.Browsers.chrome.minimum,
            firefox: UMB.Browsers.firefox.minimum,
            ie: UMB.Browsers.ie.minimum,
            opera: UMB.Browsers.opera.minimum,
            safari: UMB.Browsers.safari.minimum,
            edge: UMB.Browsers.edge.minimum,
          }, display: !0, nonCritical: !1,
        }
        h = c(h, f)
      }
    }
    return {
      load: function () {
        UMB.attach(window, 'load', function () {
            e()
            h.display && UMB.autoDisplayWidget()
          })
      },
      attach: function (a, c, e) {
        a.addEventListener ? window.addEventListener(c, e, !1) : a.attachEvent && a.attachEvent('on' + c, e)
      },
      getConfig: function () {
        e()
        return h
      },
      getCurrentBrowser: function () {
        e()
        return UMB.Detect.browser
      },
      getCurrentVersion: function () {
        e()
        return UMB.Detect.version
      },
      getBrowserInfo: function (a) {
        e()
        return UMB.Browsers[a]
      },
      getStatus: function () {
        e()
        return UMB.Status.getStatus()
      },
      displayWidget: function () {
        e()
        UMB.Widget.display()
      },
      hideWidget: function () {
        e()
        UMB.Widget.hide()
      },
      autoDisplayWidget: function () {
        e()
        var a = UMB.getStatus()
        'update' === a && h.nonCritical ? UMB.displayWidget() : 'warning' === a && UMB.displayWidget()
      },
      scrollToTop: function () {
        var a = document.body, c = document.documentElement
        c = a.clientHeight ? a : c
        c.scrollTop = 0
      },
    }
  }()
  UMB.load()
  if ('undefined' === typeof UMB) {UMB = function () {}}
  UMB.Browsers = {
    chrome: {
      name: 'Chrome',
      vendor: 'Google',
      current: '97',
      minimum: '95',
      update_url: 'https://www.google.com/chrome/browser/desktop/index.html',
      info_url: 'http://www.google.com/chrome/intl/en/more/index.html',
    },
    safari: {
      name: 'Safari',
      vendor: 'Apple',
      current: '11',
      minimum: '10',
      update_url: 'http://www.apple.com/safari/',
      info_url: 'http://www.apple.com/safari/',
    },
    edge: {
      name: 'Edge',
      vendor: 'Microsoft',
      current: '16',
      minimum: '15',
      update_url: 'https://www.microsoft.com/en-us/download/details.aspx?id=48126',
      info_url: 'https://www.microsoft.com/en-us/windows/microsoft-edge',
    },
    firefox: {
      name: 'Firefox',
      vendor: 'Mozilla',
      current: '58',
      minimum: '56',
      update_url: 'http://www.getfirefox.com/',
      info_url: 'https://www.mozilla.org/firefox/desktop/',
    },
    ie: {
      name: 'Internet Explorer',
      vendor: 'Microsoft',
      current: '11',
      minimum: '10',
      update_url: 'http://www.microsoft.com/ie',
      info_url: 'http://windows.microsoft.com/internet-explorer',
    },
    opera: {
      name: 'Opera',
      vendor: null,
      current: '48',
      minimum: '47',
      update_url: 'http://www.opera.com/browser/',
      info_url: 'http://www.opera.com/browser/features/',
    },
  }
  if ('undefined' === typeof UMB) {UMB = function () {}}
  UMB.Detect = {
    init: function () {
      this.browser = this.searchString(this.dataBrowser) || 'unknown'
      this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) ||
        'an unknown version'
      this.OS = this.searchString(this.dataOS) || 'unknown'
    }, searchString: function (c) {
      for (var a = 0; a < c.length; a++) {
        var g = c[a].string, h = c[a].prop
        this.versionSearchString = c[a].versionSearch || c[a].identity
        if (g) {
          if (-1 !== g.indexOf(c[a].subString)) return c[a].identity
        } else if (h) return c[a].identity
      }
      return null
    }, searchVersion: function (c) {
      var a =
        c.indexOf(this.versionSearchString)
      if (-1 !== a) return parseFloat(c.substring(a + this.versionSearchString.length + 1))
      return null
    }, dataBrowser: [
      {string: navigator.userAgent, subString: 'OPR/', identity: 'opera', versionSearch: 'OPR'},
      {string: navigator.userAgent, subString: 'Edge', identity: 'edge', versionSearch: 'Edge'},
      {string: navigator.userAgent, subString: 'Chrome', versionSearch: 'Chrome', identity: 'chrome'},
      {string: navigator.vendor, subString: 'Apple', identity: 'safari', versionSearch: 'Version'},
      {
        string: navigator.userAgent, subString: 'Firefox',
        versionSearch: 'Firefox', identity: 'firefox',
      },
      {string: navigator.userAgent, subString: 'MSIE', identity: 'ie', versionSearch: 'MSIE'},
      {string: navigator.userAgent, subString: 'Trident', identity: 'ie', versionSearch: 'rv'}], dataOS: [
      {string: navigator.userAgent, subString: 'iPhone', identity: 'iOS'},
      {string: navigator.userAgent, subString: 'iPad', identity: 'iOS'},
      {string: navigator.userAgent, subString: 'Android', identity: 'Android'},
      {string: navigator.platform, subString: 'Win', identity: 'Windows'},
      {
        string: navigator.platform, subString: 'Mac',
        identity: 'Mac',
      },
      {string: navigator.platform, subString: 'Linux', identity: 'Linux'}],
  }
  if ('undefined' === typeof UMB) {UMB = function () {}}
  UMB.Status = function () {
    return {
      getStatus: function () {
        var c = UMB.getBrowserInfo(UMB.Detect.browser), a = UMB.Detect.OS
        if (!c || 'iOS' === a || 'Android' === a) return 'unsupported'
        c = parseFloat(c.current)
        a = parseFloat(UMB.getConfig().require[UMB.Detect.browser])
        if (UMB.Detect.version >= c) {
          return 'latest'
        } else {
          return UMB.Detect.version >= a ? 'update' : 'warning'
        }
      },
    }
  }()
  if ('undefined' === typeof UMB) {UMB = function () {}}
  UMB.Widget = function () {
    var d = document.getElementById('chrome')
    return {
      init: function () {
      }, display: function () {
        d.style.display = 'block'
      }, hide: function () {
        d.style.display = 'none'
      }, hidePersistent: function (a) {
      },
    }
  }()
} catch (e) {throw 'JavaScript parse error (' + e.message + ').'}
