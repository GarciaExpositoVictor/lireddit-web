import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import router, { useRouter } from 'next/router';
import React from 'react';
import { useDeletePostMutation, useMeQuery } from '../generated/graphql';
interface editDeletePostButtonsProps {
  creatorId: number;
  postId: number;
}

const EditDeletePostButtons: React.FC<editDeletePostButtonsProps> = ({
  creatorId,
  postId
}) => {
  const [{ data: meData }] = useMeQuery();
  const rotuer = useRouter();
  const [, deletePost] = useDeletePostMutation();
  return meData?.me?.id !== creatorId ? null : (
    <Flex direction="row" justifyContent="end">
      <NextLink href="/post/edit/[id]" as={`/post/edit/${postId}`}>
        <IconButton
          as={Link}
          aria-label="update post"
          size="sm"
          isRound={false}
          icon={<EditIcon></EditIcon>}
          colorScheme="orange"
          mr={3}
        ></IconButton>
      </NextLink>
      <IconButton
        onClick={() => {
          deletePost({ id: postId });
          if (router.pathname !== '/') {
            router.push('/');
          }
        }}
        aria-label="delete post"
        size="sm"
        isRound={false}
        icon={<DeleteIcon></DeleteIcon>}
        colorScheme="blackAlpha"
      ></IconButton>
    </Flex>
  );
};

export default EditDeletePostButtons;
