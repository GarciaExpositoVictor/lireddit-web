import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Spacer } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface updootSectionProps {
  post: PostSnippetFragment;
}

export const UpdootSection: React.FC<updootSectionProps> = ({ post }) => {
  const [loadingState, setLoadingState] = useState<
    'updoot-loading' | 'downdoot-loading' | 'not-loading'
  >('not-loading');
  const [, vote] = useVoteMutation();
  return (
    <Flex
      direction="column"
      justifyContent="center"
      p={1}
      alignItems="center"
      alignContent="center"
      mr={4}
    >
      <IconButton
        size="sm"
        isRound={false}
        icon={<AddIcon />}
        aria-label="upvote"
        colorScheme="red"
        onClick={async () => {
          if(post.voteStatus === 1){
            return;
          }
          setLoadingState('updoot-loading');
          await vote({
            postId: post.id,
            vote: 1
          });
          setLoadingState('not-loading');
        }}
        disabled={post.voteStatus === 1}
      ></IconButton>
      <Spacer />
      <IconButton
        size="sm"
        isRound={false}
        icon={<MinusIcon />}
        aria-label="downvote"
        colorScheme="blue"
        onClick={async () => {
          setLoadingState('downdoot-loading');
          await vote({
            postId: post.id,
            vote: -1
          });
          setLoadingState('not-loading');
        }}
        disabled={post.voteStatus === -1}
      ></IconButton>
    </Flex>
  );
};
