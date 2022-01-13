// @ts-ignore
import { init, should, dbReset } from './infrastructure/spec.base';
import * as express from 'express';
import { agent } from 'supertest';
// @ts-ignore
import { loadUser } from './helpers/user.loader';
import { ValidationMessage } from '../src/types';

describe('Login', () => {
  let app: express.Express;

  beforeEach(async () => {
    app = await init();
    await dbReset();
  });

  it('should be able login an existing user', async () => {
    await loadUser(app);
    const res = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          login(request: {
            email: "test@test.com",
            password: "TEST@test123",
          }) {
            token
          }
        }
      `});

    res.status.should.equal(200);

    const result = res.body.data.login;
    should.exist(result.token);
  });

  it('Email is required', async () => {
    await loadUser(app);
    const res = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          login(request: {
            email: "",
            password: "TEST@test123",
          }) {
            token
          }
        }
      `});

    res.status.should.equal(200);

    const errorCode = res.body.errors[0].extensions.code;
    errorCode.should.equal('VALIDATION_ERRORS');

    const validations = res.body.errors[0].extensions.validations;
    const validation = validations.find((v: ValidationMessage) => { return v.property == 'email' && v.value == 'Email is required and must be in an email format.' });
    should.exist(validation);
  });

  it('Password is required', async () => {
    await loadUser(app);
    const res = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          login(request: {
            email: "test@user.com",
            password: "",
          }) {
            token
          }
        }
      `});

    res.status.should.equal(200);

    const errorCode = res.body.errors[0].extensions.code;
    errorCode.should.equal('VALIDATION_ERRORS');

    const validations = res.body.errors[0].extensions.validations;
    const validation = validations.find((v: ValidationMessage) => { return v.property == 'password' && v.value == 'Password must be length of 8 to 55.' });
    should.exist(validation);
  });

  it('User must already be registered with Email address', async () => {
    const res = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          login(request: {
            email: "test@user.com",
            password: "Test@test1234",
          }) {
            token
          }
        }
      `});

    res.status.should.equal(200);

    const errorCode = res.body.errors[0].extensions.code;
    errorCode.should.equal('VALIDATION_ERRORS');

    const validations = res.body.errors[0].extensions.validations;
    const validation = validations.find((v: ValidationMessage) => { return v.property == 'none' && v.value == 'Unable to login with the supplied data.' });
    should.exist(validation);
  });

  it('User password does not match', async () => {
    await loadUser(app);
    const res = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          login(request: {
            email: "test@test.com",
            password: "NOPE@nope1234",
          }) {
            token
          }
        }
      `});

    const errorCode = res.body.errors[0].extensions.code;
    errorCode.should.equal('VALIDATION_ERRORS');

    const validations = res.body.errors[0].extensions.validations;
    const validation = validations.find((v: ValidationMessage) => { return v.property == 'none' && v.value == 'Unable to login with the supplied data.' });
    should.exist(validation);
  });
});

