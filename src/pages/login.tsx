import React from 'react';
import { Form, Formik } from 'formik';
import { Box, Button, Flex, Link } from '@chakra-ui/react';
import { Wrapper } from '../components/wrapper';
import { InputField } from '../components/inputField';
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/errormap';
import { useRouter } from 'next/dist/client/router';
import { createUrlqlClient } from '../utils/createUrqlClient';
import { withUrqlClient } from 'next-urql';
import NextLink from 'next/link';

interface loginProps {}

const Login: React.FC<loginProps> = () => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: '', password: '' }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login(values);
          if (response.data?.login.errors) {
            setErrors(toErrorMap(response.data.login.errors));
          } else if (
            response.data?.login.user &&
            typeof router.query.next === 'string'
          ) {
            router.push(router.query.next);
          } else {
            router.push('/');
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              placeholder="username or email"
              label="Username or email"
            ></InputField>
            <Box mt={4}>
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              ></InputField>
            </Box>
            <Flex mt={2}>
              <Box>
                <NextLink href="/forgot-password">
                  <Link ml="auto">forgot password?</Link>
                </NextLink>
              </Box>
            </Flex>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};
export default withUrqlClient(createUrlqlClient)(Login);
