import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import SideMenu from '../components/SideMenu';
import { css } from '@emotion/react';
import Divider from '@mui/material/Divider';
import { useChatGPT } from '../features/BotToken/hooks/useChatGPT';
import { useSpeaker } from '../features/voicevox/useSpeaker';
import { useEffect } from 'react';
import { FetchSpeakers } from '../../wailsjs/go/app/App';
import { useMessages } from '../features/messages/useMessages';
import { useGuilds } from '../features/guilds/useGuilds';
const styles = {
  header: css({
    width: '100%',
    padding: '0.75rem',
  }),
  main: css({
    display: 'flex',
    flexGrow: 1,
  }),
  body: css({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }),
  sideMenu: css({
    display: 'flex',
    height: '100%',
    padding: '0.75rem',
  }),
  content: css({
    padding: '0.75rem',
    flex: '1 1 auto',
  }),
};

export const Layout = () => {
  void useChatGPT();
  void useMessages();

  const { fetchUserGuilds } = useGuilds();
  const { setVoices } = useSpeaker();
  useEffect(() => {
    fetchUserGuilds();
    FetchSpeakers().then(setVoices);
  }, []);

  return (
    <>
      <div css={styles.body}>
        <div css={styles.header}>
          <Header></Header>
        </div>
        <Divider />
        <div css={styles.main}>
          <div css={styles.sideMenu}>
            <SideMenu />
          </div>
          <div>
            <Divider orientation="vertical" />
          </div>
          <div css={styles.content}>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};