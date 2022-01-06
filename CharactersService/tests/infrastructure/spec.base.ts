import chai from 'chai';
import * as express from 'express';
import { Response } from 'supertest';
import startServer from '../../src/server';
import { CharacterModel } from '../../src/domain/characters/character.entity';
import { ValidationMessage } from '../../src/types';

export const should = chai.should();

let app: express.Express | null = null;

export async function init() {
  if(app) { return app; };

  const settings = {
    port: '9000',
    dbHost: 'mongodb://localhost:9002',
    dbName: 'characters-db'
  };
  app = await startServer(settings);
  return app;
}

export async function dbReset() {
  await CharacterModel.deleteMany();
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