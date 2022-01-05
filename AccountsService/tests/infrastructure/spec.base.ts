import chai from 'chai';
import * as express from 'express';
import { Response } from 'supertest';
import startServer from '../../src/server';
import { UserModel } from '../../src/entities/User';

export const should = chai.should();

let app: express.Express | null = null;

export async function init() {
  if(app) { return app; };

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

export function getValidationMessages(response: Response) {
  let messages = [];
  for(let error of response.body.errors) {
    const validations = error.extensions.exception.validationErrors;
    for(let validation of validations) {
      let properties = Object.values(validation.constraints);
      for (let propertyValue of properties) {
        messages.push({ property: validation.property, value: propertyValue });
      }
    }
  }
  return messages;
}