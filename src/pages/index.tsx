import { withUrqlClient } from 'next-urql';
import { Navbar } from '../components/navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrlqlClient } from '../utils/createUrqlClient';
import { Layout } from '../components/layout';
import React from 'react';
import { Link } from '@chakra-ui/react';
import NextLink from 'next/link';

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <Layout>
      <Link>
        <NextLink href="/create-post">create post</NextLink>
      </Link>
      {!data
        ? null
        : data.posts.map(post => <div key={post.id}>{post.title}</div>)}
    </Layout>
  );
};

export default withUrqlClient(createUrlqlClient, { ssr: true })(Index);
