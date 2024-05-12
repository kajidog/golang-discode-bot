import { Button, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useEffect, useState } from 'react';
import { EventsOn, EventsOff } from '../../wailsjs/runtime/runtime';
import { storageKeys } from '../context/storageKeys';
import { useBot } from '../app/bot/BotProvider';
import { useNavigate } from 'react-router-dom';
import { useChatGPT } from '../features/BotToken/hooks/useChatGPT';
import { useGuilds } from '../features/guilds/useGuilds';
import { GuildMembers } from '../features/guilds/GuildMembers';
import { useSpeaker } from '../features/voicevox/useSpeaker';
import { playAudio } from '../utils/audio';
import { getObjectByPath } from '../features/voicevox/speakerUtils';
import { useQueue } from '../hooks/useQueue';

type MessageEvent = {
  username: string;
  content: string;
  id: string;
  speaker: string;
};

function App() {
  const [members] = useState<any[]>([]);
  const [selected, setSelected] = useState<string>(
    () => localStorage.getItem(storageKeys.SELECT_GUILD_ID) || ''
  );
  const [messages, setMessages] = useState<MessageEvent[]>([]);
  const { fetchUserGuilds, userGuilds } = useGuilds();
  void useChatGPT();
  const { selectVoiceId } = useSpeaker();
  const { reset } = useBot();
  const { enqueueTask } = useQueue<MessageEvent>(async (task) => {
    await playAudio(task.content, String(task.speaker || '1'));
  });
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

  // メッセージ監視
  useEffect(() => {
    EventsOn('messageReceived', (message) => {
      const member = getObjectByPath(members, 'user.id', message.id);
      const speaker = selectVoiceId[member?.user?.id];

      enqueueTask({ ...message, speaker });
      setMessages((prevMessages) => [...prevMessages, { ...message, speaker }]);
    });

    return () => {
      EventsOff('messageReceived');
    };
  }, [selectVoiceId, members]);

  return (
    <div>
      <Button onClick={() => navigate('/bot/token')}>ボット設定</Button>
      <Button onClick={reset}>ボットリセット</Button>
      <div className="p-5">
        <Tabs
          scrollButtons
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
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
      <GuildMembers selected={selected}></GuildMembers>
      <div>
        {messages.map(({ username, content, speaker }) => (
          <div key={content}>
            {username}: {content}: {speaker}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
