import { Button, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { storageKeys } from '../context/storageKeys';
import { useNavigate } from 'react-router-dom';
import { useChatGPT } from '../features/BotToken/hooks/useChatGPT';
import { useGuilds } from '../features/guilds/useGuilds';
import { GuildMembers } from '../features/guilds/GuildMembers';

function App() {
  const [selected, setSelected] = useState<string>(
    () => localStorage.getItem(storageKeys.SELECT_GUILD_ID) || ''
  );
  const { fetchUserGuilds, userGuilds } = useGuilds();
  void useChatGPT();
  const navigate = useNavigate();

  // 表示するサーバ変更
  const handleChangeServer = (
    _: SyntheticEvent<Element, Event>,
    value: any
  ) => {
    localStorage.setItem(storageKeys.SELECT_GUILD_ID, String(value));
    setSelected(value);
  };

  useEffect(() => {
    fetchUserGuilds(); // ユーザーが参加しているサーバ読み込み
  }, []);

  return (
    <div>
      <Button onClick={() => navigate('/bot/token')}>ボット設定</Button>
      <Button onClick={() => navigate('/setting/user_dictionary')}>
        ユーザー辞書
      </Button>
      <div className="p-5">
        <Tabs
          scrollButtons
          allowScrollButtonsMobile
          value={selected}
          textColor="primary"
          indicatorColor="secondary"
          onChange={handleChangeServer}
        >
          {userGuilds.map((guild) => (
            <Tab label={guild?.name} value={guild.id} key={guild.id} />
          ))}
        </Tabs>
      </div>
      <GuildMembers guildId={selected}></GuildMembers>
    </div>
  );
}

export default App;
