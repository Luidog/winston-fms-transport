'use strict';
/* global describe before beforeEach it */

/* eslint-disable */

const assert = require('assert');
const { expect } = require('chai');
const chai = require('chai');

/* eslint-enable */

const path = require('path');
const environment = require('dotenv');
const varium = require('varium');
const { FilemakerTransport } = require('../index.js');

const manifestPath = path.join(__dirname, './env.manifest');

describe('Agent Tests', () => {
  let instance;

  before(() => {
    environment.config({ path: './tests/.env' });
    varium({ manifestPath });
  });

  beforeEach(done => {
    instance = new FilemakerTransport({
      database: process.env.DATABASE,
      server: process.env.SERVER,
      user: process.env.USERNAME,
      password: process.env.PASSWORD,
      infoField: 'info',
      messageField: 'message',
      layout: process.env.LAYOUT,
      level: 'silly'
    });
    done();
  });

  it('should have a log function', () => {
    assert.ok(instance.log);
    assert.equal('function', typeof instance.log);
  });

  it('should should not throw an error if connect has not been called', () => {
    const info = {
      level: 'debug',
      message: 'foo'
    };
    const result = instance.log(info);
    assert(true, result);
  });
});
