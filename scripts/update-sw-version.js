'use strict';
const fs = require('fs');
const path = require('path');

const serviceWorker = path.join(process.cwd(), path.join('src', 'js', 'service-worker.js'));

const version = Date.now();

// Read `service-worker.js` contents and replace the version
const contents = fs.readFileSync(serviceWorker, 'utf8');
const newContents = contents.replace(/^const VERSION = (?:.*?)$/m, `const VERSION = 'v${version}';`);

// Overwrite `service-worker.js`
fs.writeFileSync(serviceWorker, newContents, 'utf8');

console.log('Service worker version updated');