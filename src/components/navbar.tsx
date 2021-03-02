import { Box, Link } from '@chakra-ui/layout';
import { Button, Flex, Heading } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { loading } from '../utils/loading';
import {useRouter} from 'next/router';

interface navbarProps {}

export const Navbar: React.FC<navbarProps> = ({}) => {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({
    pause: loading()
  });

  let body = null;
  //data is still loading
  if (fetching) {
    //user still not logged in
  } else if (!data?.me) {
    //user is logged in
    body = (
      <>
        <NextLink href="/login">
          <Link color="white" mr={4}>
            Login
          </Link>
        </NextLink>
        <NextLink href="/register">
          <Link color="white" mr={4}>
            Register
          </Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            router.push('/login');
          }}
          variant="link"
          isLoading={logoutFetching}
        >
          logout
        </Button>
      </Flex>
    );
  }
  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tomato" align="center" p={4}>
      <Link>
        <NextLink href="/">
          <Heading>LiReddit</Heading>
        </NextLink>
      </Link>
      <Button colorScheme='blue' as={Link} ml={10}>
        <NextLink href="/create-post">create post</NextLink>
      </Button>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};
