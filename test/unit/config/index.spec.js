const assert = require('assert');
const decache = require('decache');

describe('config / index.js', () => {
  before(() => {
    process.env.NODE_ENV = undefined;
  });
  afterEach(() => {
    decache('../../../src/config');
  });
  after(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('when NODE_ENV is dev', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'dev';
      this.sut = require('../../../src/config');
    });
    it('should load the dev config', () => {
      assert.deepStrictEqual(this.sut, { port: '3000' });
    });
  });

  describe('when NODE_ENV is test', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'test';
      this.sut = require('../../../src/config');
    });
    it('should load the dev config', () => {
      assert.deepStrictEqual(this.sut, { port: '3000' });
    });
  });

  describe('when NODE_ENV is prod', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'prod';
      this.sut = require('../../../src/config');
    });
    it('should load the prod config', () => {
      assert.deepStrictEqual(this.sut, { port: '&&MEAL_PLANNER_API_PORT&&' });
    });
  });

  describe('when NODE_ENV is undefined', () => {
    beforeEach(() => {
      process.env.NODE_ENV = undefined;
      this.sut = require('../../../src/config');
    });
    it('should load the prod config', () => {
      assert.deepStrictEqual(this.sut, { port: '&&MEAL_PLANNER_API_PORT&&' });
    });
  });

  describe('when NODE_ENV is anything else', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'abcdefg';
      this.sut = require('../../../src/config');
    });
    it('should load the prod config', () => {
      assert.deepStrictEqual(this.sut, { port: '&&MEAL_PLANNER_API_PORT&&' });
    });
  });
});
