// lib/apollo.ts
import { ApolloClient, from, HttpLink, InMemoryCache, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { useSessionStore } from '../store/auth';

const httpLink = new HttpLink({
  uri: `${process.env.EXPO_PUBLIC_BACKEND_URL}/graphql/`,
});

// Auth link — FIXED for Django
const authLink = setContext((_, { headers }) => {
  const token = useSessionStore.getState().session?.jwt;

  return {
    headers: {
      ...headers,
      // These are commonly needed for Django + CSRF + CORS
      'content-type': 'application/json',
      'x-csrftoken': '', // Django usually doesn't need it for JWT
      Authorization: token ? `Bearer ${token}` : '', // ← THIS IS THE KEY FIX
    },
  };
});

// WebSocket link — MUST send token in connectionParams for Django
const wsLink = new GraphQLWsLink(
  createClient({
    url: `${process.env.EXPO_PUBLIC_BACKEND_URL?.replace('http', 'ws')}/graphql/`,
    connectionParams: () => {
      const token = useSessionStore.getState().session?.jwt;
      return {
        headers: {
          Authorization: token ? `Bearer ${token}` : '',
        },
      };
    },
    // Optional: reconnect on token change
    shouldRetry: () => true,
  })
);

// Split: subscriptions → WebSocket, others → HTTP
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink) // ← authLink first, then httpLink
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          myProfiles: {
            merge(existing = {}, incoming) {
              return { ...existing, ...incoming };
            },
          },
        },
      },
    },
  }),
});

export default client;