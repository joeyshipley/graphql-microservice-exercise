import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';
import resolvers from '../resolvers';
import { EnvValue } from "../types";

const startServer = async (settings: { port: EnvValue, dbHost: EnvValue, dbName: EnvValue })  => {
  const PORT = settings.port;
  const DBHOST = settings.dbHost;
  const DBNAME = settings.dbName;

  const schema = await buildSchema({
    resolvers: resolvers,
    emitSchemaFile: true,
    validate: false,
  });

  const mongoose = await connect(`${ DBHOST }/${ DBNAME }`);
  await mongoose.connection;

  const server = new ApolloServer({
    schema,
    plugins: [ ApolloServerPluginLandingPageGraphQLPlayground ],
  });

  const app = Express();

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready and listening at ==> http://localhost:${PORT}${server.graphqlPath}`
    )
  );

  return app;
};

export default startServer;
