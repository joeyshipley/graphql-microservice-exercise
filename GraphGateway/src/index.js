const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');
const fs = require('fs');

const PORT = process.env.PORT;

const supergraphSdl = fs.readFileSync('./src/supergraph.graphql').toString();

const gateway = new ApolloGateway({
  supergraphSdl
});

const server = new ApolloServer({
  gateway,
});

server.listen({ port: PORT }).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${ url }`);
}).catch(err => {console.error(err)});
