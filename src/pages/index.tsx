import { withUrqlClient } from 'next-urql';
import { usePostsQuery } from '../generated/graphql';
import { createUrlqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/layout';
import React, { useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Spacer,
  Stack,
  Text
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { UpdootSection } from '../components/updootSection';

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as string | null
  });
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
            <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
              <UpdootSection post={post}></UpdootSection>
              <Box>
                <Flex alignItems='center' justifyItems='center' alignContent="center">
                  <Heading>{post.title}</Heading>
                  <Badge colorScheme={post.points < 0 ? 'red' : 'green'} ml={1} borderRadius={10} alignSelf='start'>{post.points}</Badge>
                </Flex>
                <Text>posted by {post.creator.username}</Text>
                <Text mt={4}>{post.text}</Text>
              </Box>
            </Flex>
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
