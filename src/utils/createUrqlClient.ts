import { dedupExchange } from '@urql/core';
import { Exchange, fetchExchange } from 'urql';
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  LoginMutation,
  RegisterMutation
} from '../generated/graphql';
import { betterUpdateQuery } from '../pages/betterUpdateQuery';
import { cacheExchange } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { pipe, tap } from 'wonka';

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      //If OperationREsult has an error send a request to sentry
      if (error?.message.includes('not authenticated')) {
        Router.replace('/login');
      }
    })
  );
};

export const createUrlqlClient = (ssrExchange: any) => ({
  url: 'http://localhost:4000/graphql',
  fetchOptions: {
    credentials: 'include' as const
  },
  exchanges: [
    dedupExchange,
    cacheExchange({
      updates: {
        Mutation: {
          logout: (_result, _args, cache, _info) => {
            betterUpdateQuery<LogoutMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              () => ({ me: null })
            );
          },
          login: (_result, _args, cache, _info) => {
            betterUpdateQuery<LoginMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.login.errors) {
                  return query;
                } else {
                  return {
                    me: result.login.user
                  };
                }
              }
            );
          },
          register: (_result, _args, cache, _info) => {
            betterUpdateQuery<RegisterMutation, MeQuery>(
              cache,
              { query: MeDocument },
              _result,
              (result, query) => {
                if (result.register?.errors) {
                  return query;
                } else {
                  return {
                    me: result.register?.user
                  };
                }
              }
            );
          }
        }
      }
    }),
    errorExchange,
    ssrExchange,
    fetchExchange
  ]
});
