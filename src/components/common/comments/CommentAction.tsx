import React, { FC } from 'react';
import styles from './Comments.module.sass';
import ButtonReply from '../button/ButtonReply';
import { CommentActionProps } from 'src/models/comments';
import ButtonVotes from '../button/buttons-vote/ButtonVotes';
import { ReactionEnum } from '@subsocial/types/dto';
import { useResponsiveSize } from "../../responsive/ResponsiveContext";
import ModalSendTips from "../../modal/modal-send-tips/ModalSendTips";
import ButtonSendTips from '../../common/button/button-send-tips/ButtonSendTips';
import { useModal } from "src/hooks/useModal";
import { ACCOUNT_STATUS } from 'src/models/auth';
import { useAuth } from 'src/components/auth/AuthContext';
import { config } from 'src/config';

const CommentAction: FC<CommentActionProps> = ({ onReply, comment }) => {
  const { isMobile } = useResponsiveSize();

  const { isVisible, toggleModal } = useModal();
  const { status } = useAuth();
  const isAuthRequired = status !== ACCOUNT_STATUS.AUTHORIZED;

  return (
    <div className={styles.group}>
       <ModalSendTips open={isVisible} toggleModal={toggleModal} ownerId={comment.ownerId}/>
      <ButtonSendTips
                onClick={toggleModal}
                className={styles.button}
                disabled={config.enableTips && isAuthRequired}
              />
      <ButtonVotes
        post={comment}
        reactionEnum={ReactionEnum.Upvote}
        withLabel={!isMobile}
      />
      <ButtonVotes
        post={comment}
        reactionEnum={ReactionEnum.Downvote}
        withLabel={!isMobile}
      />
      <ButtonReply
        onClick={onReply}
        withLabel={!isMobile}
      />
    </div>
  );
};

export default CommentAction;
