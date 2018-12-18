const path = require('path');
const net = require('net');
const http = require('http');
const express = require('express');
const proxy = require('http-proxy-middleware');
const debug = exports.debug = require('debug')('webdriverio-tests-specs');

/**
 * higher order middleware.
 *
 * @param {express.RequestHandler} middleware
 * @return {express.RequestHandler}
 */
const noApiCall = middleware => (req, res, next) => {
  if (req.path.startsWith('/api')) {
    next();
    return;
  }

  middleware(req, res, next);
};

class Environment {
  constructor() {
    /** @type {net.Socket[]} */
    this._sockets = [];
  }

  get app() {
    return this._app;
  }

  _getServerHost() {
    if (!this._server) {
      return '<unknown>';
    }

    const address = this._server.address();
    switch (address.family) {
      case 'IPv4': {
        return `${address.address}:${address.port}`;
      }
      case 'IPv6': {
        return `[${address.address}]:${address.port}`;
      }
    }
  }

  async beforeEach() {
    this._app = express();
    this._server = new http.Server(this._app);

    // socket accounting
    this._server.on('connection', socket => {
      this._sockets.push(socket);

      socket.once('close', () => {
        const socketIndex = this._sockets.indexOf(socket);
        if (socketIndex === -1) {
          // should not happen
          return;
        }

        this._sockets.splice(socketIndex, 1);
      });
    });

    if (process.env.NODE_ENV === 'development') {
      // in dev-mode we use parcel server serving the client
      debug('dev mode');
      this._app.use(noApiCall(proxy({target: 'http://localhost:1234', changeOrigin: true, logLevel: 'silent'})));
    } else {
      // in prod-mode we serve from dist (result of `npm run build`)
      debug('prod mode');
      this._app.use(noApiCall(express.static(path.resolve(__dirname, '../dist'))));
    }

    await new Promise((resolve, reject) => {
      this._server.listen(3000, () => {
        debug(`server ${this._getServerHost()} open`);
        resolve();
      });
    });
  }

  async afterEach() {
    // close sockets so closing server is much faster
    for (const socket of this._sockets) {
      socket.end();
    }

    this._sockets = [];

    await new Promise((resolve, reject) => {
      const addressWhenOpen = this._getServerHost();
      debug(`closing server ${addressWhenOpen}`);
      this._server.close(() => {
        debug(`server ${addressWhenOpen} closed`);
        resolve();
      });
    });

    this._server = undefined;
    this._app = undefined;
  }
}

exports.setupEnv = () => {
  const environment = new Environment();

  beforeEach(async () => {
    await environment.beforeEach();
  });

  afterEach(async () => {
    await environment.afterEach();
  });

  return environment;
};