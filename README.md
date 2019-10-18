<!--@h1([pkg.name])-->
# winston-fms-transport
<!--/@-->

[![Build Status](https://travis-ci.org/Luidog/winston-fms-transport.png?branch=master)](https://travis-ci.org/Luidog/winston-fms-transport)[![Coverage Status](https://coveralls.io/repos/github/Luidog/winston-fms-transport/badge.svg?branch=master)](https://coveralls.io/github/Luidog/winston-fms-transport?branch=master)[![Known Vulnerabilities](https://snyk.io/test/github/Luidog/winston-fms-transport/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Luidog/winston-fms-transport?targetFile=package.json)[![GitHub issues](https://img.shields.io/github/issues/Luidog/winston-fms-transport.svg?style=plastic)](https://github.com/Luidog/winston-fms-transport/issues) [![Github commits (since latest release)](https://img.shields.io/github/commits-since/luidog/winston-fms-transport/latest.svg)](https://img.shields.io/github/issues/Luidog/winston-fms-transport.svg) [![GitHub license](https://img.shields.io/github/license/Luidog/winston-fms-transport.svg)](https://github.com/Luidog/winston-fms-transport/blob/master/LICENSE.md)

A transport to support logging via winston to FileMaker Server

<!--@installation()-->
## Installation

```sh
npm install --save winston-fms-transport
```
<!--/@-->

## Usage

This is a winston log transport designed to send logs to a FileMaker file via the Data API. This transport uses [fms-api-client](https://github.com/Luidog/fms-api-client) and [marpat](https://github.com/Luidog/marpat). To use this transport you must first call marpat's connect function. Marpat is designed to allow the use of multiple datastores with the focus on encrypted file storage and project flexibility. Once connected to marpat, a FileMaker transport will be created and used to transfer logs. Note that if connect is not called, this transport will log a message to the console but not throw an error.

<!--@snippet('./example.js#connect-to-datastore', { showSource: true })-->
```js
connect('nedb://memory')
  .then(db => {
```

> Excerpt from [./example.js](./example.js#L12-L13)
<!--/@-->

A transport is defined with the following properties. Note the `infoField`, `messageField`, and `layout` properties. The layout property specifices the layout to use in Filemaker when creating log records. The `infoField` will be used for the log data and the `messageField` will be used for the log message. All other properties conform the the properties required by the [fms-api-client](https://github.com/Luidog/fms-api-client).

<!--@snippet('./example.js#create-filemaker-transport', { showSource: true })-->
```js
const filemakerTransport = level =>
  new FilemakerTransport({
    database: process.env.DATABASE,
    server: process.env.SERVER,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    infoField: 'info',
    messageField: 'message',
    layout: process.env.LAYOUT
  });
```

> Excerpt from [./example.js](./example.js#L16-L26)
<!--/@-->

Once a transport is created it can be added to a logger instance like any other transport.

<!--@snippet('./example.js#add-logger-transport', { showSource: true })-->
```js
const logger = createLogger({
  transports: [filemakerTransport()],
  exitOnError: false
});
```

> Excerpt from [./example.js](./example.js#L29-L32)
<!--/@-->

Once defined, the logger can be called from within the node application and logs of the appropriate level will be sent to FileMaker.

<!--@snippet('./example.js#use-logger-transport', { showSource: true })-->
```js
logger.silly('Message', { db: 'this is a message' });
```

> Excerpt from [./example.js](./example.js#L39-L39)
<!--/@-->

## Tests

```sh
npm install
npm test
```

<!--@execute('npm run test',[])-->
```default
> winston-fms-transport@1.0.2 test /Users/luidelaparra/Documents/Development/winston-fms-transport
> nyc _mocha --recursive ./tests --timeout=30000



  Agent Tests
    ✓ should have a log function
    ✓ should should not throw an error if connect has not been called

  Client Test
    ✓ should reject if it can not send a message
    ✓ should reuse the same client to try and send a message

  Log Test
    ✓ should be able send a log to FileMaker
    ✓ should be able send multiple messages on the same client

  Transport Tests
    ✓ should have a log function
    ✓ should return true without a callback
    ✓ should return true with a callback (271ms)
    ✓ should reject and log an error if there is an error (105ms)


  10 passing (454ms)

---------------------------|----------|----------|----------|----------|-------------------|
File                       |  % Stmts | % Branch |  % Funcs |  % Lines | Uncovered Line #s |
---------------------------|----------|----------|----------|----------|-------------------|
All files                  |      100 |    83.33 |      100 |      100 |                   |
 winston-fms-transport     |      100 |      100 |      100 |      100 |                   |
  index.js                 |      100 |      100 |      100 |      100 |                   |
 winston-fms-transport/src |      100 |    83.33 |      100 |      100 |                   |
  index.js                 |      100 |      100 |      100 |      100 |                   |
  transport.model.js       |      100 |    83.33 |      100 |      100 |                52 |
---------------------------|----------|----------|----------|----------|-------------------|
```
<!--/@-->

<!--@dependencies()-->
## <a name="dependencies">Dependencies</a>

- [fms-api-client](https://github.com/Luidog/fms-api-client): A FileMaker Data API client designed to allow easier interaction with a FileMaker application from a web environment.
- [marpat](https://github.com/luidog/marpat): A class-based ES6 ODM for Mongo-like databases.
- [winston](https://github.com/winstonjs/winston): A logger for just about everything.

<!--/@-->

<!--@devDependencies()-->
## <a name="dev-dependencies">Dev Dependencies</a>

- [chai](https://github.com/chaijs/chai): BDD/TDD assertion library for node.js and the browser. Test framework agnostic.
- [coveralls](https://github.com/nickmerwin/node-coveralls): takes json-cov output into stdin and POSTs to coveralls.io
- [dotenv](https://github.com/motdotla/dotenv): Loads environment variables from .env file
- [eslint](https://github.com/eslint/eslint): An AST-based pattern checker for JavaScript.
- [eslint-config-google](https://github.com/google/eslint-config-google): ESLint shareable config for the Google style
- [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier): Turns off all rules that are unnecessary or might conflict with Prettier.
- [eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier): Runs prettier as an eslint rule
- [jsdoc](https://github.com/jsdoc3/jsdoc): An API documentation generator for JavaScript.
- [minami](https://github.com/Nijikokun/minami): Clean and minimal JSDoc 3 Template / Theme
- [mos](https://github.com/mosjs/mos): A pluggable module that injects content into your markdown files via hidden JavaScript snippets
- [mos-plugin-dependencies](https://github.com/mosjs/mos/tree/master/packages/mos-plugin-dependencies): A mos plugin that creates dependencies sections
- [mos-plugin-execute](https://github.com/team-767/mos-plugin-execute): Mos plugin to inline a process output
- [mos-plugin-license](https://github.com/mosjs/mos-plugin-license): A mos plugin for generating a license section
- [mocha](https://github.com/mochajs/mocha): simple, flexible, fun test framework
- [mocha-lcov-reporter](https://github.com/StevenLooman/mocha-lcov-reporter): LCOV reporter for Mocha
- [nyc](https://github.com/istanbuljs/nyc): the Istanbul command line interface
- [prettier](https://github.com/prettier/prettier): Prettier is an opinionated code formatter
- [varium](https://npmjs.org/package/varium): A strict parser and validator of environment config variables

<!--/@-->

<!--@license()-->
## License

[MIT](./LICENSE) © Lui de la Parra
<!--/@-->
