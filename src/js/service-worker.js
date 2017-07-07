/**
 * Check out https://googlechrome.github.io/sw-toolbox/docs/master/index.html for
 * more info on how to use sw-toolbox to custom configure your service worker.
 */
'use strict';
importScripts('/sw-toolbox.js');

const VERSION = 'v1499422710046';

self.toolbox.options.cache = {
    name: 'zdw-' + VERSION
};

const assets = [
    './css/styles.css',
    './js/scripts.js',
    './about.html',
    './art-advisory.html',
    './contact.html',
    './index.html',
    './outside-the-lines.html',
    './selected-work.html',
    './series-of-landscapes.html'
];

// pre-cache our key assets
self.toolbox.precache(assets);

// dynamically cache any other local assets
self.toolbox.router.any('./img/*', self.toolbox.cacheFirst);

assets.forEach(function(asset) {
    self.toolbox.router.any(asset, self.toolbox.cacheFirst);
});

// for any other requests go to the network, cache,
// and then only use that cached resource if your user goes offline
self.toolbox.router.default = self.toolbox.networkFirst;