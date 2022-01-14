import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { ENV } from './environment-variables';

const FETCHQL = {
  query: performQueryCall,
  mutate: performMutationCall,
};
export default FETCHQL;

async function performQueryCall(graphCommandContent) {
  const client = getGraphClient();
  return await client.query({
    query: gql`${ graphCommandContent }`
  })
    .then(parseServerGraphResponse)
    .catch(parseServerGraphError);
}

async function performMutationCall(graphCommandContent) {
  const client = getGraphClient();
  return await client.mutate({
    mutation: gql`${ graphCommandContent }`
  })
    .then(parseServerGraphResponse)
    .catch(parseServerGraphError);
}

function getGraphClient() {
  const client = new ApolloClient({
    uri: ENV.SERVER_GRAPH_URL,
    cache: new InMemoryCache()
  });
  return client;
}

function parseServerGraphResponse(response) {
  return { data: response.data, validations: [] };
}

function parseServerGraphError(error) {
  if(!error || !error.graphQLErrors) { return error; }
  let results = [];
  for(let data of error.graphQLErrors) {
    results = (data.extensions.code == 'VALIDATION_ERRORS')
      ? [ ...results, ...data.extensions.validations ]
      : [ ...results, data ]
  }
  return { data: null, validations: results };
}