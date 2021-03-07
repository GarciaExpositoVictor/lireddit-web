import { AddIcon, MinusIcon } from '@chakra-ui/icons';
import { Flex, IconButton, Spacer } from '@chakra-ui/react';
import React, { useState } from 'react';
import { PostSnippetFragment, useVoteMutation } from '../generated/graphql';

interface updootSectionProps {
  post: PostSnippetFragment;
}

type updootState = {
  voteStatus: 'updoot-loading' | 'downdoot-loading' | 'not-loading';
}

export const UpdootSection: React.FC<updootSectionProps> = ({ post }) => {
  const [setLoadingState] = useState<updootState>({voteStatus: 'not-loading'});
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
          setLoadingState.voteStatus='updoot-loading';
          await vote({
            postId: post.id,
            vote: 1
          });
          setLoadingState.voteStatus = 'not-loading';
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
          setLoadingState.voteStatus = 'downdoot-loading';
          await vote({
            postId: post.id,
            vote: -1
          });
          setLoadingState.voteStatus = 'not-loading';
        }}
        disabled={post.voteStatus === -1}
      ></IconButton>
    </Flex>
  );
};
