// @ts-ignore
import { init, should, dbReset, getValidationMessages } from './infrastructure/spec.base';
import * as express from 'express';
import { agent } from 'supertest';
import { UserModel } from '../src/domain/users/user.entity';

describe('Create UserEntity', () => {
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
          registerUser(request: {
            username: "test user",
            email: "test@test.com",
            password: "TEST@test123",
            passwordConfirmation: "TEST@test123"
          }) {
            user {
              id
              username
              email
              createdOn
            }
          }
        }
      `});

    res.status.should.equal(200);
    const result = res.body.data.registerUser;

    should.exist(result.user);
    result.user.username.should.equal('test user');
    result.user.email.should.equal('test@test.com');
    should.exist(result.user.createdOn);
    should.exist(result.user.id);
  });

  it('Username is required', async () => {
    const res = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          registerUser(request: {
            username: "",
            email: "test@test.com",
            password: "TEST@test123",
            passwordConfirmation: "TEST@test123"
          }) {
            user {
              id
            }
          }
        }
      `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'username' && v.value == 'Username must be length of 5 to 35.' });
    should.exist(validation);
  });

  it('Username must be unique', async () => {
    const res1 = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          registerUser(request: {
            username: "test user",
            email: "test1@user.com",
            password: "TEST@test123",
            passwordConfirmation: "TEST@test123"
          }) {
            user {
              id
            }
          }
        }
      `});

    const res2 = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          registerUser(request: {
            username: "test user",
            email: "test2@user.com",
            password: "TEST@test123",
            passwordConfirmation: "TEST@test123"
          }) {
            user {
              id
            }
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
          registerUser(request: {
            username: "test user",
            email: "",
            password: "TEST@test123",
            passwordConfirmation: "TEST@test123"
          }) {
            user {
              id
            }
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
          registerUser(request: {
            username: "test user 1",
            email: "test@user.com",
            password: "TEST@test123",
            passwordConfirmation: "TEST@test123"
          }) {
            user {
              id
            }
          }
        }
      `});

    const res2 = await agent(app)
      .post('/graphql')
      .send({ query: `
        mutation {
          registerUser(request: {
            username: "test user 2",
            email: "test@user.com",
            password: "TEST@test123",
            passwordConfirmation: "TEST@test123"
          }) {
            user {
              id
            }
          }
        }
      `});

    res1.status.should.equal(200);
    res2.status.should.equal(200);

    const validations = getValidationMessages(res2);
    const validation = validations.find((v) => { return v.property == 'email' && v.value == 'Email is not available.' });
    should.exist(validation);
  });

  it('Password is required', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "test@user.com",
              password: "",
              passwordConfirmation: "TEST@test123",
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'password' && v.value == 'Password must be length of 8 to 55.' });
    should.exist(validation);
  });

  it('Password Confirmation is required', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "test@user.com",
              password: "TEST@test123",
              passwordConfirmation: "",
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);
    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'passwordConfirmation' && v.value == 'Password Confirmation is required.' });
    should.exist(validation);
  });

  it('Password and Password Confirmation must match', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "test@user.com",
              password: "TEST@test123",
              passwordConfirmation: "test!TEST456",
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'passwordConfirmation' && v.value == 'Password and Password Confirmation must match.' });
    should.exist(validation);
  });

  it('Password must be at least 8 long', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "T@t4567",
              password: "T@t4567",
              passwordConfirmation: "",
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'password' && v.value == 'Password must be length of 8 to 55.' });
    should.exist(validation);
  });

  it('Password must be not be longer than 55', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "test@user.com",
              password: "TEST@test123456789012345678901234567890123456789012345678901234567890",
              passwordConfirmation: "TEST@test123456789012345678901234567890123456789012345678901234567890",
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'password' && v.value == 'Password must be length of 8 to 55.' });
    should.exist(validation);
  });

  it('Password must have an uppercase letter', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "test@user.com",
              password: "test@test123",
              passwordConfirmation: "test@test123",
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'password' && v.value == 'Password must contain an Uppercase and Lowercase letter, along with a Number and a Special character.' });
    should.exist(validation);
  });

  it('Password must have an lowercase letter', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "test@user.com",
              password: "TEST@TEST123",
              passwordConfirmation: "TEST@TEST123",
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'password' && v.value == 'Password must contain an Uppercase and Lowercase letter, along with a Number and a Special character.' });
    should.exist(validation);
  });

  it('Password must have a number', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "test@user.com",
              password: "TEST@test",
              passwordConfirmation: "TEST@test",
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'password' && v.value == 'Password must contain an Uppercase and Lowercase letter, along with a Number and a Special character.' });
    should.exist(validation);
  });

  it('Password must have a special character', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "test@user.com",
              password: "TESTtest123",
              passwordConfirmation: "TESTtest123",
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);

    const validations = getValidationMessages(res);
    const validation = validations.find((v) => { return v.property == 'password' && v.value == 'Password must contain an Uppercase and Lowercase letter, along with a Number and a Special character.' });
    should.exist(validation);
  });

  it('Password must not be stored in plain text', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
          mutation {
            registerUser(request: {
              username: "test user",
              email: "test@test.com",
              password: "TEST@test123",
              passwordConfirmation: "TEST@test123"
            }) {
              user {
                id
              }
            }
          }
        `});

    res.status.should.equal(200);
    const result = res.body.data.registerUser;

    const savedUser = await UserModel.findOne({ id: result.id });
    should.exist(savedUser);
    should.exist(savedUser?.password);
    savedUser?.password.should.not.equal('TEST@test123');
  });

  it('Password must NOT be allowed to come back on a creation result', async () => {
    const res = await agent(app)
        .post('/graphql')
        .send({ query: `
        mutation {
          registerUser(request: {
            username: "test user",
            email: "test@user.com",
            password: "TEST@test123",
            passwordConfirmation: "TEST@test123",
          }) {
            user {
              id
              username
              email
              password
            }
          }
        }
      `});

    res.status.should.equal(400);
    res.text.should.contain('Cannot query field \\"password\\');
  });
});

