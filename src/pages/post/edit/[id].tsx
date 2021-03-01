import { Box, Button } from '@chakra-ui/react';
import { Form, Formik } from 'formik';
import { withUrqlClient } from 'next-urql';
import { useRouter } from 'next/router';
import React from 'react';
import { InputField } from '../../../components/inputField';
import { Layout } from '../../../components/layout';
import {
  usePostQuery,
  useUpdatePostMutation
} from '../../../generated/graphql';
import { createUrlqlClient } from '../../../utils/createUrqlClient';
import { useIsAuth } from '../../../utils/useIsAuth';

interface editPostProps {}

const EditPost: React.FC<editPostProps> = ({}) => {
  useIsAuth();
  const [, updatePost] = useUpdatePostMutation();
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
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ id, ...values });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="title"
              placeholder="title"
              label="title"
            ></InputField>
            <Box mt={4}>
              <InputField
                name="text"
                placeholder="text"
                label="Body"
                textarea={true}
              ></InputField>
            </Box>
            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              update post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrlqlClient)(EditPost);
