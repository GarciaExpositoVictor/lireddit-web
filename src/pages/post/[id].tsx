import { Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import React from 'react';
import EditDeletePostButtons from '../../components/editDeletePostButtons';
import { Layout } from '../../components/layout';
import { createUrlqlClient } from '../../utils/createUrqlClient';
import { useGetPostFromUrl } from '../../utils/useGetPostFromUrl';

const Post = ({}) => {
  const [{ data, error, fetching }] = useGetPostFromUrl();

  if (error) {
    return <Layout>{error}</Layout>;
  }

  if (fetching) {
    return <Layout>...Loading</Layout>;
  }

  if (!data?.post) {
    return <Layout>post not found</Layout>;
  }
  return (
    <Layout>
      <Heading>{data.post.title}</Heading>
      {data.post.text}
      <EditDeletePostButtons
        creatorId={data.post.creatorId}
        postId={data.post.id}
      ></EditDeletePostButtons>
    </Layout>
  );
};

export default withUrqlClient(createUrlqlClient, { ssr: true })(Post);
