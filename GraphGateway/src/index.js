const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');
const waitOn = require('wait-on');

const PORT = process.env.PORT || 3000;
const accountsUrl = process.env.ACCOUNTS_URL || 'http://localhost:3001';
const charactersUrl = process.env.CHARACTERS_URL || 'http://localhost:3002';

async function startServer() {
  const serviceList = [
    { name: "accounts", url: `${ accountsUrl }/graphql` },
    { name: "characters", url: `${ charactersUrl }/graphql` },
  ];
  const gateway = new ApolloGateway({
    serviceList,
  });
  const { schema, executor } = await gateway.load();
  const server = new ApolloServer({
    schema,
    executor,
    tracing: false,
    playground: true,
  });

  return server
    .listen({ port: PORT })
    .then(({ url }) => {
      console.log(`Apollo Gateway ready at ${ url }`);
    })
    .catch(err => { console.error(err) });
}



const opts = {
  resources: [
    `${ accountsUrl }/health`,
    `${ charactersUrl }/health`,
  ],
  delay: 1000, // initial delay in ms, default 0
  interval: 250, // poll interval in ms, default 250ms
  simultaneous: 1, // limit to 1 connection per resource at a time
  timeout: 30000, // timeout in ms, default Infinity
  tcpTimeout: 1000, // tcp timeout in ms, default 300ms
  window: 1000, // stabilization time in ms, default 750ms
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default if not provided
  }
};

waitOn(opts)
  .then(startServer)
  .catch(function (err) {
    console.error(err);
  });
