import { ApolloClient } from 'apollo-client';
import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider, useQuery } from '@apollo/react-hooks'
import React from 'react'
import ReactDOM from 'react-dom';
import Pages from './pages';
import injectStyles from './styles'
import { resolvers, typeDefs } from './resolvers'
import gql from 'graphql-tag';
import Login from './pages/login';


const IS_LOGGED_IN = gql`
    query IsUserLoggedIn {
        isLoggedIn @client
    }
`;

function IsLoggedIn() {
    const { data } = useQuery(IS_LOGGED_IN);
    return data.isLoggedIn ? <Pages /> : <Login />
}

const cache = new InMemoryCache();
// const link = new HttpLink({
//     uri: 'http://localhost:4000'
// });

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    link: new HttpLink({
        uri: 'http://localhost:4000/graphql',
        headers: {
            authorization: localStorage.getItem('token')
        },
    }),
    typeDefs,
    resolvers
});

cache.writeData({
    data: {
        isLoggedIn: !!localStorage.getItem('token'),
        cartItems: []
    },
})



// ... instantiate the client context tree

injectStyles();
ReactDOM.render(
    <ApolloProvider client={client}>
        <IsLoggedIn />
    </ApolloProvider>,
    document.getElementById('root')
);