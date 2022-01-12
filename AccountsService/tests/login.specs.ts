// @ts-ignore
import { init, should, dbReset, getValidationMessages } from './infrastructure/spec.base';
import * as express from 'express';
import { agent } from 'supertest';
// @ts-ignore
import { loadUser } from './helpers/user.loader';

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
            authenticated,
            token
          }
        }
      `});

    res.status.should.equal(200);
    const result = res.body.data.login;
    result.authenticated.should.equal(true);
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
            authenticated,
            token
          }
        }
      `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'email' && v.value == 'Email is required and must be in an email format.' });
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
            authenticated,
            token
          }
        }
      `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'password' && v.value == 'Password must be length of 8 to 55.' });
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
            authenticated,
            token
          }
        }
      `});

    res.status.should.equal(200);

    const result = res.body.data.login;
    result.authenticated.should.equal(false);
    result.token.should.equal('');
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
            authenticated,
            token
          }
        }
      `});

    res.status.should.equal(200);
    const result = res.body.data.login;
    result.authenticated.should.equal(false);
    result.token.should.equal('');
  });
});

