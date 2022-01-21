import { ApolloClient, InMemoryCache, gql, ApolloLink, HttpLink } from '@apollo/client';
import { ENV } from './environment-variables';

const FETCHQL = {
  query: query,
  mutate: mutate,
};
export default FETCHQL;

export async function query(graphCommandContent, options = {}) {
  const client = getGraphClient(options);
  return await client.query({
    query: gql`${ graphCommandContent }`
  })
    .then(parseServerGraphResponse)
    .catch(parseServerGraphError);
}

async function mutate(graphCommandContent, options = {}) {
  const client = getGraphClient(options);
  return await client.mutate({
    mutation: gql`${ graphCommandContent }`
  })
    .then(parseServerGraphResponse)
    .catch(parseServerGraphError);
}

function getGraphClient(options) {
  const client = new ApolloClient({
    link: buildLink(options.authToken),
    cache: new InMemoryCache()
  });
  return client;
}

function buildLink(authToken = null) {
  const apolloLink = new ApolloLink((operation, forward) => {
    operation.setContext({
      headers: {
        authorization: authToken ? `Bearer ${ authToken }` : ''
      }
    });
    return forward(operation);
  });
  const httpLink = new HttpLink({ uri: ENV.SERVER_GRAPH_URL });
  return apolloLink.concat(httpLink);
}

function parseServerGraphResponse(response) {
  return { data: response.data, validations: [] };
}

function parseServerGraphError(error) {
  if(error && error.networkError) {
    return error.networkError;
  }
  if(!error || !error.graphQLErrors) { return error; }
  let results = [];
  for(let data of error.graphQLErrors) {
    results = (data.extensions.code == 'VALIDATION_ERRORS')
      ? [ ...results, ...data.extensions.validations ]
      : [ ...results, data ]
  }
  return { data: null, validations: results };
}