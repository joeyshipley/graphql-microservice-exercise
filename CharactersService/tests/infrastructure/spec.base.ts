import chai from 'chai';
import * as express from 'express';
import startServer from '../../src/server';
import { CharacterModel } from '../../src/domain/characters/character.entity';

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
