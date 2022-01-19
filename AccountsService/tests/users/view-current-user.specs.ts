// @ts-ignore
import { init, should, dbReset } from '../infrastructure/spec.base';
import * as express from 'express';
import { agent } from 'supertest';
// @ts-ignore
import { loadUser } from '../helpers/user.loader';

describe('View Current User', () => {
  let app: express.Express;

  beforeEach(async () => {
    app = await init();
    await dbReset();
  });

  it('should be to show the logged in user their information', async () => {
    const existingUserId = await loadUser(app, 'test.123@user.com');
    const res = await agent(app)
      .post('/graphql')
      .set('graph-context', `{"authPayload":{"userId":"${ existingUserId }"}}`)
      .send({ query: `
        query {
          viewCurrentUser {
            user {
              id
              email
              username
              createdOn
            }
          }
        }
      `});

    res.status.should.equal(200);

    const result = res.body.data.viewCurrentUser.user;
    result.id.should.equal(existingUserId);
    result.email.should.equal('test.123@user.com');
  });

  it('view current must be authorized', async () => {
    const res = await agent(app)
      .post('/graphql')
      .set('graph-context', '{"authPayload":{"userId":""}}')
      .send({ query: `
        query {
          viewCurrentUser {
            user {
              id
              email
              username
              createdOn
            }
          }
        }
      `});

    res.status.should.equal(200);

    const errorCode = res.body.errors[0].extensions.code;
    errorCode.should.equal('UNAUTHENTICATED');
  });
});

