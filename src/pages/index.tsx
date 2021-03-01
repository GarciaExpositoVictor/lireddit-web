import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text
} from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';
import React, { useState } from 'react';
import EditDeletePostButtons from '../components/editDeletePostButtons';
import { Layout } from '../components/layout';
import { UpdootSection } from '../components/updootSection';
import {
  useDeletePostMutation,
  useMeQuery,
  usePostsQuery
} from '../generated/graphql';
import { createUrlqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [{ data: meData }] = useMeQuery();
  const [variables, setVariables] = useState({
    limit: 20,
    cursor: null as string | null
  });
  const [{ data, fetching }] = usePostsQuery({
    variables
  });

  const [, deletePost] = useDeletePostMutation();
  if (!fetching && !data) {
    return <div>you got no posts, create one!</div>;
  }

  return (
    <Layout>
      {fetching && !data ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((post) =>
            !post ? null : (
              <Flex key={post.id} p={5} shadow="md" borderWidth="1px">
                <UpdootSection post={post}></UpdootSection>
                <Box w="100%">
                  <Flex
                    alignItems="center"
                    justifyItems="center"
                    alignContent="center"
                  >
                    <Link>
                      <NextLink href="/post/[id]" as={`/post/${post.id}`}>
                        <Heading>{post.title}</Heading>
                      </NextLink>
                    </Link>
                    <Badge
                      colorScheme={post.points < 0 ? 'red' : 'green'}
                      ml={1}
                      borderRadius={10}
                      alignSelf="start"
                    >
                      {post.points}
                    </Badge>
                  </Flex>
                  <Box>
                    <Text>posted by {post.creator.username}</Text>
                    <Text mt={4}>{post.text}</Text>
                  </Box>
                  <EditDeletePostButtons
                    creatorId={post.creatorId}
                    postId={post.id}
                  ></EditDeletePostButtons>
                </Box>
              </Flex>
            )
          )}
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
