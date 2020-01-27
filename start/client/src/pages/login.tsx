/**
 *  In a useMutation, the first value in the useMutation result tuple is a mutate function that actually triggers the mutation when it is called.
 * The second value in the result tuple is a result object that contains loading and error state, as well as the return value from the mutation.
 */

import React from 'react';
import { useApolloClient, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag';

import { LoginForm, Loading } from '../components';
import ApolloClient from 'apollo-client';
import * as LoginTypes from './__generated__/login'


export const LOGIN_USER = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`


export default function Login() {
  const client: ApolloClient<any> = useApolloClient();
  const [login, { data }] = useMutation<LoginTypes.login, LoginTypes.loginVariables>(LOGIN_USER, {
    onCompleted({ login }) {
      localStorage.setItem('token', login as string);
      client.writeData({ data: { isLoggedIn: true } })
    }
  })
  return <LoginForm login={login} />
}