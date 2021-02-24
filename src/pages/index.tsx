import { withUrqlClient } from 'next-urql';
import { Navbar } from '../components/navbar';
import { usePostsQuery } from '../generated/graphql';
import { createUrlqlClient } from '../utils/createUrqlClient';

const Index = () => {
  const [{data}] = usePostsQuery();
  return (
    <>
      <Navbar></Navbar>
      {!data ? null : data.posts.map(post => <div key={post.id}>{post.title}</div>)}
    </>
  );
};

export default withUrqlClient(createUrlqlClient, { ssr: true })(Index);
