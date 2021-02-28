import { withUrqlClient } from 'next-urql';
import { usePostsQuery } from '../generated/graphql';
import { createUrlqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/layout';
import React, { useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text
} from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = () => {
  const [variables, setVariables] = useState({ limit: 20, cursor: null as string | null });
  const [{ data, fetching }] = usePostsQuery({
    variables
  });

  if (!fetching && !data) {
    return <div>you got no posts, create one!</div>;
  }

  return (
    <Layout>
      <Flex align="center">
        <Heading>LiReddit</Heading>
        <Link ml="auto">
          <NextLink href="/create-post">create post</NextLink>
        </Link>
      </Flex>
      <br />
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <Heading>{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            Load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withUrqlClient(createUrlqlClient, { ssr: true })(Index);
