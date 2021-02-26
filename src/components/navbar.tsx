import { Box, Link } from '@chakra-ui/layout';
import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import NextLink from 'next/link';
import { useMeQuery, useLogoutMutation } from '../generated/graphql';
import { loading } from '../utils/loading';

interface navbarProps {}

export const Navbar: React.FC<navbarProps> = ({}) => {
  const [{fetching: logoutFetching}, logout] = useLogoutMutation();
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
          onClick={() => {
            logout();
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
    <Flex zIndex={1} position="sticky" top={0} bg="tomato" p={4}>
      <Box ml={'auto'}>{body}</Box>
    </Flex>
  );
};
