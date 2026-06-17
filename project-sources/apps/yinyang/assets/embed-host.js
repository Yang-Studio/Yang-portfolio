(function (root) {
  'use strict';

  var instances = new Map();
  var sequence = 0;

  function buildUrl(src, options) {
    var url = new URL(src, document.baseURI);
    var params = options || {};
    ['theme', 'screen', 'name', 'date', 'time', 'calendar', 'gender', 'place', 'longitude', 'meridian'].forEach(function (key) {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') url.searchParams.set(key, params[key]);
    });
    if (params.leapMonth) url.searchParams.set('leapMonth', '1');
    if (params.trueSolarTime) url.searchParams.set('trueSolarTime', '1');
    if (params.transparent) url.searchParams.set('transparent', '1');
    if (params.autostart) url.searchParams.set('autostart', '1');
    return url.toString();
  }

  function mount(target, options) {
    options = options || {};
    var container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!container) throw new Error('BaZiEmbed: target container not found');

    var id = 'bazi-widget-' + (++sequence);
    var iframe = document.createElement('iframe');
    iframe.id = id;
    iframe.title = options.title || '八字排盘';
    iframe.src = buildUrl(options.src || 'embed.html', options);
    iframe.loading = options.loading || 'lazy';
    iframe.referrerPolicy = options.referrerPolicy || 'strict-origin-when-cross-origin';
    iframe.style.display = 'block';
    iframe.style.width = '100%';
    iframe.style.height = (options.initialHeight || 760) + 'px';
    iframe.style.border = options.border || '0';
    iframe.style.background = options.transparent ? 'transparent' : (options.background || '#FAFAFA');
    iframe.style.overflow = options.maxHeight ? 'auto' : 'hidden';
    iframe.setAttribute('scrolling', options.maxHeight ? 'yes' : 'no');

    container.innerHTML = '';
    container.appendChild(iframe);

    var api = {
      iframe: iframe,
      setTheme: function (theme) { send(iframe, 'bazi:setTheme', { theme: theme }); },
      setBirth: function (birth) { send(iframe, 'bazi:setBirth', { birth: birth }); },
      calculate: function (birth) { send(iframe, 'bazi:calculate', { birth: birth || {} }); },
      reset: function () { send(iframe, 'bazi:reset'); },
      destroy: function () {
        instances.delete(iframe.contentWindow);
        iframe.remove();
      }
    };
    instances.set(iframe.contentWindow, { iframe: iframe, api: api, options: options, ready: false, queue: [] });
    return api;
  }

  function send(iframe, type, payload) {
    if (!iframe || !iframe.contentWindow) return;
    var message = Object.assign({ type: type, source: 'bazi-host' }, payload || {});
    var instance = instances.get(iframe.contentWindow);
    if (instance && !instance.ready) {
      instance.queue.push(message);
      return;
    }
    iframe.contentWindow.postMessage(message, '*');
  }

  window.addEventListener('message', function (event) {
    var instance = instances.get(event.source);
    if (!instance || !event.data || event.data.source !== 'bazi-widget') return;
    var message = event.data;
    if (message.type === 'bazi:resize' && Number.isFinite(message.height)) {
      var nextHeight = Math.max(320, message.height);
      if (instance.options.maxHeight) nextHeight = Math.min(nextHeight, instance.options.maxHeight);
      instance.iframe.style.height = nextHeight + 'px';
    }
    if (message.type === 'bazi:ready') {
      instance.ready = true;
      instance.queue.splice(0).forEach(function (queued) {
        instance.iframe.contentWindow.postMessage(queued, '*');
      });
      if (typeof instance.options.onReady === 'function') instance.options.onReady(instance.api, message);
    }
    if (message.type === 'bazi:screen' && typeof instance.options.onScreen === 'function') {
      instance.options.onScreen(message.screen, instance.api);
    }
    if (message.type === 'bazi:result' && typeof instance.options.onResult === 'function') {
      instance.options.onResult(message, instance.api);
    }
  });

  root.BaZiEmbed = { mount: mount };
})(window);
