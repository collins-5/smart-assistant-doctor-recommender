// ~/lib/graphql/apolloClient.ts
import { ApolloClient, InMemoryCache, HttpLink, from, split } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';
import { useSessionStore } from '~/lib/store/auth';

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
if (!BACKEND_URL) throw new Error("Missing EXPO_PUBLIC_BACKEND_URL");

// HTTP Link
const httpLink = new HttpLink({
  uri: `${BACKEND_URL.replace(/\/+$/, '')}/graphql/`,
});

// CRITICAL FIX: Use a function that reads fresh state every time
const authLink = setContext((_, { headers }) => {
  // This runs on EVERY request — gets latest token
  const token = useSessionStore.getState().session?.jwt;

  console.log('authLink: Sending token →', token ? 'YES' : 'NO');
  console.log('🌐 GRAPHQL ENDPOINT:', `${BACKEND_URL}/graphql/`);
  console.log('🔑 FULL TOKEN BEING SENT:', token); // Log the FULL token
  console.log('📤 HEADERS:', {
    ...headers,
    Authorization: token ? `Bearer ${token}` : '',
  });

  return {
    headers: {
      ...headers,
      origin: process.env.EXPO_PUBLIC_MOBILE_ORIGIN || 'health-app',
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// WebSocket Link
const wsLink = new GraphQLWsLink(
  createClient({
    url: BACKEND_URL.replace('http', 'ws').replace(/\/+$/, '') + '/graphql/',
    connectionParams: () => {
      const token = useSessionStore.getState().session?.jwt;
      return { Authorization: token ? `Bearer ${token}` : '' };
    },
  })
);

const splitLink = split(
  ({ query }) => {
    const def = getMainDefinition(query);
    return def.kind === 'OperationDefinition' && def.operation === 'subscription';
  },
  wsLink,
  from([authLink, httpLink])
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;