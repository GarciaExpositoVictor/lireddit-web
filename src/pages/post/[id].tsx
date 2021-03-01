import { Heading } from '@chakra-ui/react';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { Layout } from '../../components/layout';
import { usePostQuery } from '../../generated/graphql';
import { createUrlqlClient } from '../../utils/createUrqlClient';

const Post = ({}) => {
  const router = useRouter();
  const id =
    typeof router.query.id === 'string' ? parseInt(router.query.id, 10) : -1;
  const [{ data, error, fetching }] = usePostQuery({
    pause: id === -1,
    variables: {
      id
    }
  });

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
    </Layout>
  );
};

export default withUrqlClient(createUrlqlClient, { ssr: true })(Post);
