// browser.debug() should work without timeout
const millis10Minutes = 10 * (60 * 1000);

exports.config = {
  ...require('./wdio.conf').config,
  waitforTimeout: millis10Minutes,
  mochaOpts: {
    timeout: millis10Minutes
  },
};