const assert = require('assert');
const {setupEnv} = require('./env');

describe('App', () => {

  const env = setupEnv();

  it('should have default browser title', async () => {
    await browser.url('/');
    const title = await browser.getTitle();
    assert.strictEqual(title, 'webdriverio tested app');
  });

  it('should show correct message of the day', async () => {
    const testMotd = 'The message of the day.';

    // mock endpoint
    env.app.get('/api/motd', (req, res) => {
      res.writeHead(200, {'content-type': 'application/json'});
      res.end(JSON.stringify(testMotd));
    });

    await browser.url('/');

    let motd;
    await browser.waitUntil(async () => {
      motd = await browser.getText('#motd');
      return !!motd;
    });

    assert.strictEqual(motd, testMotd);
  });
});