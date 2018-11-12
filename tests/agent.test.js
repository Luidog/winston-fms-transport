'use strict';
/* global describe beforeEach it */

/* eslint-disable */

const assert = require('assert');
const { expect } = require('chai');
const chai = require('chai');

/* eslint-enable */

const environment = require('dotenv');
const varium = require('varium');
const MESSAGE = Symbol.for('message');
const { FilemakerTransport } = require('../index.js');

environment.config({ path: './tests/.env' });
varium(process.env, './tests/env.manifest');

describe('Agent Tests', () => {
  let instance, result, database;

      beforeEach(done => {
        instance = new FilemakerTransport({
          application: process.env.APPLICATION,
          server: process.env.SERVER,
          user: process.env.USERNAME,
          password: process.env.PASSWORD,
          infoField: 'info',
          messageField: 'message',
          layout: process.env.LAYOUT,
          level: 'silly'
        });
        done()
      })

  it('should have a log function', () => {
    assert.ok(instance.log);
    assert.equal('function', typeof instance.log);
  });

  it('should should not throw an error if connect has not been called', () => {
    var info = {
      level: 'debug',
      message: 'foo'
    };
    var result = instance.log(info);
    assert(true, result);
  });

});