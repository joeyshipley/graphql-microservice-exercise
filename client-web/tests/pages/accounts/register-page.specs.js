import chai from 'chai';
import sinon from 'sinon';
chai.should();

import kata from '../src/kata';
import thing from '../src/thing';

describe(`The great kata boiler of '21.`, () => {
  let _sandbox;

  beforeEach(() => {
    _sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    _sandbox.restore();
  });

  describe('Katas are great when they work.', () => {
    it('produces the kata message we expected.', async () => {
      // Act
      const result = kata.start();

      // Assert
      result.should.equal('DEPENDENCY IS GO!');
    });

    it('allows tests to control dependency output.', async () => {
      // Arrange
      _sandbox
        .stub(thing, 'doIt')
        .returns('NOPE!');

      // Act
      const result = kata.start();

      // Assert
      result.should.equal('NOPE!');
    });

    it('allows the dependency to be reset back to default.', async () => {
      // Act
      const result = kata.start();

      // Assert
      result.should.equal('DEPENDENCY IS GO!');
    });
  });
});