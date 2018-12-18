# webdriverio tests

Possible boilerplate setup for a webdriverio tested project.

## development

*preferred way of testing while developing*

* `npm start`: runs parcel bundler serving on http://localhost:1234
* `npm run test:dev`: starts **wdio** tests against parcel served content

## production

*preferred way a build pipeline run the tests against minified code*

* `npm run build`: build app into `/dist`
* `npm run test:prod`: starts **wdio** tests against `/dest` served content