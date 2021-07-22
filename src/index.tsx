import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import { createClient, Provider, dedupExchange, fetchExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { cacheExchange } from '@urql/exchange-graphcache';

import './index.css';
import App from './App';

const client = new ApolloClient({
  uri: 'https://api.spacex.land/graphql',
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          launch(_, { args, toReference }) {
            return toReference({
              __typename: 'Launch',
              id: args?.id,
            });
          },
        },
      },
    },
  }),
});

// Note: we could implement custom exchanges here or use and provide custom
// clients for special needs in requests. The custom exchanges could then
// implement conditions based on operations context just like the
// https://github.com/FormidableLabs/urql/blob/main/exchanges/request-policy/src/requestPolicyExchange.ts
// this would allow more control on e.g. the refocus exchange when wrapped.
const urqlClient = createClient({
  url: 'https://api.spacex.land/graphql',
  exchanges: [
    devtoolsExchange,
    dedupExchange,
    cacheExchange({
      resolvers: {
        Query: {
          launch: (_parent, args) => ({ __typename: 'Launch', id: args.id }),
        },
      },
    }),
    fetchExchange,
  ],
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider value={urqlClient}>
        <App />
      </Provider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

export { urqlClient };
