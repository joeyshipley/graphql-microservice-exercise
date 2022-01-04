import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';
import Express from 'express';
import 'reflect-metadata';
import { buildSchema } from 'type-graphql';
import { connect } from 'mongoose';

import { UserResolver } from './resolvers/User';

const main = async () => {
  const PORT = process.env.PORT;
  const DBHOST = process.env.DBHOST;
  const DBNAME = process.env.DBNAME;

  const schema = await buildSchema({
    resolvers: [
      UserResolver
    ],
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
};

main().catch((error) => {
  console.log(error, 'error');
});
