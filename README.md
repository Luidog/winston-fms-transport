# winston-fms-transport [![Build Status](https://travis-ci.org/Luidog/winston-fms-transport.png?branch=master)](https://travis-ci.org/Luidog/winston-fms-transport)[![Coverage Status](https://coveralls.io/repos/github/Luidog/winston-fms-transport/badge.svg?branch=master)](https://coveralls.io/github/Luidog/winston-fms-transport?branch=master)

A transport to support logging via winston to FileMaker Server

## Installation

This is a [Node.js](https://nodejs.org/) module available through the
[npm registry](https://www.npmjs.com/). It can be installed using the
[`npm`](https://docs.npmjs.com/getting-started/installing-npm-packages-locally)
or
[`yarn`](https://yarnpkg.com/en/)
command line tools.

```sh
npm install winston-fms-transport --save
```

## Usage

```js
'use strict';

const { connect } = require('marpat');
const { createLogger } = require('winston');
const environment = require('dotenv');
const varium = require('varium');
const { FilemakerTransport } = require('./index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

connect('nedb://memory')
  .then(db => {
    const filemakerTransport = level =>
      new FilemakerTransport({
        application: process.env.APPLICATION,
        server: process.env.SERVER,
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        level: level,
        infoField: 'info',
        messageField: 'message',
        layout: process.env.LAYOUT
      });

    const logger = createLogger({
      transports: [filemakerTransport('silly')],
      exitOnError: false
    });

    logger.emitErrs = true;
    return logger;
  })
  .then(logger => logger.info('Message', { db: 'this is a message' }));
```

## Tests

```sh
npm install
npm test
```

```
> winston-fms-transport@0.0.1 test /winston-fms-transport
> nyc _mocha --recursive ./tests --timeout=30000
  .log()
    ✓ should be present
    ✓ should return true without a callback
    ✓ should return true with a callback
  3 passing (25ms)
---------------------------|----------|----------|----------|----------|-------------------|
File                       |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
---------------------------|----------|----------|----------|----------|-------------------|
All files                  |    84.85 |        0 |    57.14 |    84.85 |                   |
 winston-fms-transport     |      100 |      100 |      100 |      100 |                   |
  index.js                 |      100 |      100 |      100 |      100 |                   |
 winston-fms-transport/src |    83.87 |        0 |    57.14 |    83.87 |                   |
  index.js                 |      100 |      100 |      100 |      100 |                   |
  transport.model.js       |    82.76 |        0 |    57.14 |    82.76 |    32,33,47,50,51 |
---------------------------|----------|----------|----------|----------|-------------------|
```

## Dependencies

* [fms-api-client](https://ghub.io/fms-api-client): A FileMaker Data API client designed to allow easier interaction with a FileMaker application from a web environment.
* [marpat](https://ghub.io/marpat): A class-based ES6 ODM for Mongo-like databases.
* [transport](https://ghub.io/transport): a hub for centralizing all your request handlers within your application
* [winston](https://ghub.io/winston): A multi-transport async logging library for Node.js

## Dev Dependencies

* [chai](https://ghub.io/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
* [coveralls](https://ghub.io/coveralls): takes json-cov output into stdin and POSTs to coveralls.io
* [dotenv](https://ghub.io/dotenv): Loads environment variables from .env file
* [eslint](https://ghub.io/eslint): An AST-based pattern checker for JavaScript.
* [eslint-config-google](https://ghub.io/eslint-config-google): ESLint shareable config for the Google style
* [eslint-config-prettier](https://ghub.io/eslint-config-prettier): Turns off all rules that are unnecessary or might conflict with Prettier.
* [eslint-plugin-prettier](https://ghub.io/eslint-plugin-prettier): Runs prettier as an eslint rule
* [jsdocs](https://ghub.io/jsdocs): jsdocs
* [minami](https://ghub.io/minami): Clean and minimal JSDoc 3 Template / Theme
* [mocha](https://ghub.io/mocha): simple, flexible, fun test framework
* [mocha-lcov-reporter](https://ghub.io/mocha-lcov-reporter): LCOV reporter for Mocha
* [nyc](https://ghub.io/nyc): the Istanbul command line interface
* [package-json-to-readme](https://ghub.io/package-json-to-readme): Generate a README.md from package.json contents
* [prettier](https://ghub.io/prettier): Prettier is an opinionated code formatter
* [varium](https://ghub.io/varium): A strict parser and validator of environment config variables

## License

MIT
