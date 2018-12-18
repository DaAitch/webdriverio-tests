exports.config = {
  baseUrl: 'http://wdio-tests.local',
  specs: './specs/**/*.spec.js',
  maxInstances: 10,
  capabilities: [{
    maxInstances: 5,
    browserName: 'firefox',
    proxy: {
      proxyType: 'manual',
      httpProxy: 'localhost:3000',
      sslProxy: 'localhost:3000'
    }
  }],
  sync: false,
  logLevel: process.env.DEBUG ? 'verbose' : 'silent',
  coloredLogs: true,
  deprecationWarnings: true,
  bail: 0,
  screenshotPath: './screenshots/',
  waitforTimeout: 3000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  services: ['selenium-standalone'],
  framework: 'mocha',
  mochaOpts: {ui: 'bdd'}
};
