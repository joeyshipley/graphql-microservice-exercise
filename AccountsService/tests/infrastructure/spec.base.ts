import chai from 'chai';
import { ENV } from '../../src/server/environment-variables';
import * as express from 'express';
import { Response } from 'supertest';
import startServer from '../../src/server';
import sinon from 'sinon';
import { UserModel } from '../../src/domain/users/user.entity';
import { ValidationMessage } from '../../src/types';

export const should = chai.should();

let app: express.Express | null = null;

export async function init() {
  if(app) { return app; };

  const envSandbox = sinon.createSandbox();
  envSandbox.stub(ENV, 'ENCRYPT_SALT').value('1d0jjf1030j12s18r1yg31o8ng86sm5o');
  envSandbox.stub(ENV, 'ENCRYPT_KEY').value('SUPERSECRETKEY');
  envSandbox.stub(ENV, 'TOKEN_KEY').value('my-32-character-ultra-secure-and-ultra-long-secret');

  const settings = {
    port: '9000',
    dbHost: 'mongodb://localhost:9001',
    dbName: 'accounts-db'
  };
  app = await startServer(settings);
  return app;
}

export async function dbReset() {
  await UserModel.deleteMany();
}

// TODO: consider home (and/or implementation) for this, it will also be needed on the client/consumer side.
// NOTE: will decide once I see what the consumer looks like on the GraphQL client.
export function getValidationMessages(response: Response): ValidationMessage[] {
  let messages: ValidationMessage[] = [];
  if(!response.body.errors) { return messages; }

  for(let error of response.body.errors) {
    const validations = error.extensions.exception.validationErrors;
    for(let validation of validations) {
      let properties = Object.values(validation.constraints);
      for (let propertyValue of properties) {
        messages.push({ property: validation.property, value: propertyValue as string | null });
      }
    }
  }
  return messages;
}