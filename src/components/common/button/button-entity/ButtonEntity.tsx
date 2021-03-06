import React, { FC } from 'react';
import { Button } from '@mui/material';
import classNames from 'classnames';
import styles from './ButtonEntity.module.sass';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { ButtonEntityProps } from 'src/models/common/button';
import { useLocalStorage } from 'src/hooks/useLocalStorage';


const ButtonEntity: FC<ButtonEntityProps> = ({ typeEntity, ...props }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [spaceId, setSpaceId] = useLocalStorage<string>('spaceId', "");
  
  const createEntity = () => {
    router.push(typeEntity === 'post' ? '/posts/new' : '/new');
    setSpaceId("");
  };
  return (
    <Button
      {...props}
      variant="outlined"
      onClick={createEntity}
      className={classNames([ styles.spaceButton ], {
        [styles.postButton]: typeEntity === 'post',
      })}
    >
      <span>+</span>{' '}
      {/* {typeEntity === 'post' ? t('buttons.newPost') : t('buttons.createSpace')} */}
      {typeEntity === 'post' ? "New Question" : "New Topic"}
    </Button>
  );
};

export default ButtonEntity;
