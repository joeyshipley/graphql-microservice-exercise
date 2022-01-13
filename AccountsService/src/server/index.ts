import gql from 'graphql-tag';
import { printSchema } from 'graphql';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { buildSchema, BuildSchemaOptions, createResolversMap } from 'type-graphql';

import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Express from 'express';
import 'reflect-metadata';
import { connect } from 'mongoose';
import resolvers from '../resolvers';
import { EnvValue } from '../types';

const startServer = async (settings: { port: EnvValue, dbHost: EnvValue, dbName: EnvValue })  => {
  const PORT = settings.port;
  const DBHOST = settings.dbHost;
  const DBNAME = settings.dbName;

  const mongoose = await connect(`${ DBHOST }/${ DBNAME }`);
  await mongoose.connection;

  const options: BuildSchemaOptions = {
    resolvers: resolvers,
    emitSchemaFile: true,
    validate: false,
    skipCheck: true,
  };
  const schema = await buildSchema(options);

  const federatedSchema = buildSubgraphSchema({
    typeDefs: gql(printSchema(schema)),
    resolvers: createResolversMap(schema) as any
  });

  const server = new ApolloServer({
    schema: federatedSchema,
    context: ({ req }) => {
      const context = (req.headers['graph-context']) ? JSON.parse(req.headers['graph-context'] as string) : null;
      return context;
    },
    plugins: [ ApolloServerPluginLandingPageGraphQLPlayground ],
  });

  const app = Express();

  await server.start();

  server.applyMiddleware({ app });

  // @ts-ignore
  app.get('/health', (req, res) => { res.status(200).send('Ok'); });
  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready and listening at ==> http://localhost:${PORT}${server.graphqlPath}`
    )
  );

  return app;
};

export default startServer;
