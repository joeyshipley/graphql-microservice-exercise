// @ts-ignore
import { init, should, dbReset } from './infrastructure/spec.base';
import * as express from 'express';
import { agent } from 'supertest';
import { ValidationMessage } from '../src/types';

describe('Create Character', () => {
  let app: express.Express;

  beforeEach(async () => {
    app = await init();
    await dbReset();
  });

  it('should be able create a new character', async () => {
    const res = await agent(app)
      .post('/graphql')
      .set('graph-context', '{"authPayload":{"userId":"61df052e2126a025510e55ee"}}')
      .send({ query: `
        mutation {
          createCharacter(request: {
            name: "Sir Big Bird"
          }) {
            character {
              id
              playerId
              name
              createdOn
            }
          }
        }
      `});

    res.status.should.equal(200);
    const result = res.body.data.createCharacter;

    should.exist(result.character);
    should.exist(result.character.id);
    should.exist(result.character.createdOn);
    result.character.name.should.equal('Sir Big Bird');
    result.character.playerId.should.equal('61df052e2126a025510e55ee');
  });

  it('Character creation must be authorized', async () => {
    const res = await agent(app)
      .post('/graphql')
      .set('graph-context', '{"authPayload":{"userId":""}}')
      .send({ query: `
        mutation {
          createCharacter(request: {
            name: ""
          }) {
            character {
              id
              playerId
              name
              createdOn
            }
          }
        }
      `});

    res.status.should.equal(200);

    const errorCode = res.body.errors[0].extensions.code;
    errorCode.should.equal('UNAUTHENTICATED');
  });

  it('Name is required', async () => {
    const res = await agent(app)
      .post('/graphql')
      .set('graph-context', '{"authPayload":{"userId":"61df052e2126a025510e55ee"}}')
      .send({ query: `
        mutation {
          createCharacter(request: {
            name: ""
          }) {
            character {
              id
              playerId
              name
              createdOn
            }
          }
        }
      `});

    res.status.should.equal(200);

    const errorCode = res.body.errors[0].extensions.code;
    errorCode.should.equal('VALIDATION_ERRORS');

    const validations = res.body.errors[0].extensions.validations;
    const validation = validations.find((v: ValidationMessage) => { return v.property == 'name' && v.value == 'Character Name must be length of 4 to 35.' });
    should.exist(validation);
  });
});

