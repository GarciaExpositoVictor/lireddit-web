import { withUrqlClient } from 'next-urql';
import { usePostsQuery } from '../generated/graphql';
import { createUrlqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/layout';
import React from 'react';
import { Box, Flex, Heading, Link, Stack, Text } from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = () => {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      limit: 10
    }
  });
  return (
    <Layout>
      <Flex align="center">
        <Heading>LiReddit</Heading>
        <Link ml="auto">
          <NextLink href="/create-post">create post</NextLink>
        </Link>
      </Flex>
      <br />
      {fetching && !data ? <div>loading...</div> : (
        <Stack spacing={8}>
          {data.posts.map((post) => (
            <Box key={post.id} p={5} shadow="md" borderWidth="1px">
              <Heading>{post.title}</Heading>
              <Text mt={4}>{post.textSnippet}</Text>
            </Box>
          ))}
        </Stack>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrlqlClient, { ssr: true })(Index);
