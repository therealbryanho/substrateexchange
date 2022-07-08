import { AppBar, Toolbar, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import styles from './Header.module.sass';
import { Box } from '@mui/system';
import Title from '../common/title/Title';
import { TitleSizes } from '../../models/common/typography';
import { useAppDispatch, useAppSelector } from 'src/store/app/store';
import { toggleAccount } from 'src/store/features/mainSlice';
import { HeaderProps } from '../../models/header';
import { useSelectProfile } from '../../store/features/profiles/profilesHooks';
import { useAuth } from '../auth/AuthContext';
import { useApi } from '../api';
import classNames from 'classnames';
import IconButton from '@mui/material/IconButton';
import { useResponsiveSize } from '../responsive/ResponsiveContext';
import Image from '../common/image/Image';
import ButtonEntity from '../common/button/button-entity/ButtonEntity';
import ButtonNotification from '../common/button/button-notification/ButtonNotification';
import ButtonSignIn from '../common/button/button-sign-in/ButtonSignIn';
import ButtonProfile from '../common/button/button-profile/ButtonProfile';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import ButtonIcon from '../common/button/button-icon/ButtonIcon';

const Header: FC<HeaderProps> = ({
  label,
  isShowingMobileBurger,
  onMobileBurgerClick,
}) => {
  const dispatch = useAppDispatch();
  const { address, accounts } = useAppSelector((state) => state.myAccount);
  const profile = useSelectProfile(address);
  const account = accounts?.find((acc) => acc.address === address);
  const { openSingInModal } = useAuth();
  const { api } = useApi();
  const [hasSpace, setHasSpace] = useState(false);
  const { isDesktop } = useResponsiveSize();
  const { t } = useTranslation();

  const router = useRouter();
  const onClickMenu = (href: string) => {
    if (href) {
      router.push(href);
      return;
    }
  };

  useEffect(() => {
    (async () => {
      if (!address) return null;
      await api.subsocial.substrate.spaceIdsByOwner(address).then((data) => {
        if (data.length) {
          setHasSpace(true);
        } else {
          setHasSpace(false);
        }
      });
    })();
  }, [address, api]);

  return (
    <AppBar
      position="fixed"
      className={classNames(styles.bar, {
        [styles.barWithMenu]: isShowingMobileBurger,
      })}
    >
      <Toolbar className={styles.header}>
        <div className={styles.menu}>
          {!isDesktop ? (
            <IconButton
              className={styles.icon}
              size="large"
              edge="start"
              onClick={onMobileBurgerClick}
            >
              {isShowingMobileBurger ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          ) : (
            <Link href={'/'}>
              <Image
                src={'/substrateexchange-logo.png'}
                alt={'Substrate Exchange logo'}
                width={200}
                height={30}
              />
            </Link>
          )}
          <Title type={TitleSizes.PREVIEW} className={styles.label}>
            <Link href={'/'}>
              <a>{label}</a>
            </Link>
          </Title>
        </div>

        <Box className={styles.user}>
          {!address || (!profile && !account) ? (
            <ButtonSignIn onClick={openSingInModal} />
          ) : (
            <>
              {isDesktop && <ButtonEntity typeEntity={hasSpace ? 'post' : 'space'} />}

              <ButtonNotification />

              <ButtonIcon
                onClick={() => router.push(`/accounts/${address}`)}
              >
                <PersonOutlineIcon />
              </ButtonIcon>

              <ButtonProfile
                onClick={() => dispatch(toggleAccount())}
                address={address}
                name={profile?.content?.name || account?.name}
                avatar={profile?.content?.avatar}
              />
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
