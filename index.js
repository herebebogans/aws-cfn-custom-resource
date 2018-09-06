'use strict';

let globalTunnel = require('global-tunnel-ng');
const url = require('url');

if ((process.env.HTTPS_PROXY || process.env.HTTP_PROXY) && !process.env.LOCAL) {

  const proxy = url.parse(process.env.HTTPS_PROXY || process.env.HTTP_PROXY);
  globalTunnel.initialize({
    host: proxy.hostname,
    port: proxy.port,
    sockets: 50 // optional pool size for each http and https
  });
}

// Convenience file to require the library from the root of the repository
module.exports = require('./lib/resource');
