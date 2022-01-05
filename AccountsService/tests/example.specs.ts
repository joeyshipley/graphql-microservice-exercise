// @ts-ignore
import { init, should, dbReset, getValidationMessages } from './infrastructure/spec.base';
import * as express from 'express';
import { agent } from 'supertest';

describe('Create User', () => {
  let app: express.Express;

  beforeEach(async () => {
    app = await init();
    await dbReset();
  });

  it('should be able create a new user', async () => {
    const res = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          createUser(request: {
            username: "test user",
            email: "test@test.com"
          }) {
            id
            email
            username
          }
        }
      `});

    res.status.should.equal(200);
    const result = res.body.data.createUser;

    result.username.should.equal('test user');
    result.email.should.equal('test@test.com');
    should.exist(result.id);
  });

  it('Username is required', async () => {
    const res = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          createUser(request: {
            username: "",
            email: "test@test.com"
          }) {
            id
            email
            username
          }
        }
      `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'username' && v.value == 'Username must be length of 5 to 35' });
    should.exist(validation);
  });

  it('Username must be unique', async () => {
    const res1 = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          createUser(request: {
            username: "test user",
            email: "test1@user.com"
          }) {
            id
            email
            username
          }
        }
      `});

    const res2 = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          createUser(request: {
            username: "test user",
            email: "test2@user.com"
          }) {
            id
            email
            username
          }
        }
      `});

    res1.status.should.equal(200);
    res2.status.should.equal(200);

    const validations = getValidationMessages(res2);
    const validation = validations.find((v) => { return v.property == 'username' && v.value == 'Username is not available.' });
    should.exist(validation);
  });

  it('Email is required', async () => {
    const res = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          createUser(request: {
            username: "test user",
            email: ""
          }) {
            id
            email
            username
          }
        }
      `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'email' && v.value == 'Email is required and must be in an email format.' });
    should.exist(validation);
  });

  it('Email must be unique', async () => {
    const res1 = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          createUser(request: {
            username: "test user 1",
            email: "test@user.com"
          }) {
            id
            email
            username
          }
        }
      `});

    const res2 = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          createUser(request: {
            username: "test user 2",
            email: "test@user.com"
          }) {
            id
            email
            username
          }
        }
      `});

    res1.status.should.equal(200);
    res2.status.should.equal(200);

    const validations = getValidationMessages(res2);
    const validation = validations.find((v) => { return v.property == 'email' && v.value == 'Email is not available.' });
    should.exist(validation);
  });

});

