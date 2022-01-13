import chai from 'chai';
import { ENV } from '../../src/server/environment-variables';
import * as express from 'express';
import startServer from '../../src/server';
import sinon from 'sinon';
import { UserModel } from '../../src/domain/users/user.entity';

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
