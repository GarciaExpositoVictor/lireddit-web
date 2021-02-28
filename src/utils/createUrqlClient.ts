import { dedupExchange, stringifyVariables } from '@urql/core';
import { cacheExchange, Resolver } from '@urql/exchange-graphcache';
import Router from 'next/router';
import { Exchange, fetchExchange } from 'urql';
import { pipe, tap } from 'wonka';
import {
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation
} from '../generated/graphql';
import { betterUpdateQuery } from '../pages/betterUpdateQuery';

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
      keys: {
        PaginatedPosts: () => null
      },
      resolvers: {
        Query: {
          posts: cursorPagination()
        }
      },
      updates: {
        Mutation: {
          createPost: (_result, _args, cache, _info) => {
            const allFields = cache.inspectFields('Query');
            const fieldInfos = allFields.filter(
              (info) => info.fieldName === 'posts'
            );
            fieldInfos.forEach((fi) => {
              if (fi.arguments) {
                cache.invalidate('Query', 'posts', fi.arguments);
              }
            });
          },
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

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isInCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      'posts'
    );
    info.partial = !isInCache;
    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolveFieldByKey(
        entityKey,
        fieldInfo.fieldKey
      ) as string;
      const data = cache.resolve(key, 'posts') as string[];
      const more = cache.resolve(key, 'hasMore');
      if (!more) {
        hasMore = false;
      }
      results.push(...data);
    });
    return {
      __typename: 'PaginatedPosts',
      hasMore,
      posts: results
    };
  };
};
