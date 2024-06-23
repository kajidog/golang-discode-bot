import { Divider, Tab, Tabs } from '@mui/material';
import { GuildsTab } from '../features/guilds/GuildsTab';
import { useGuildsTab } from '../features/guilds/useGuildsTab';
import { useChannels } from '../features/channels/useChannels';
import { useEffect, useRef, useState } from 'react';
import { useMessagesContext } from '../app/messages/MessagesProvider';
function App() {
  const { selectedGuildId } = useGuildsTab();
  const [selectedChannelId, setSelectedChannelId] = useState('');

  const { messages } = useMessagesContext();

  const { channels, fetchChannels } = useChannels();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedChannelId('');
    fetchChannels(selectedGuildId);
  }, [selectedGuildId]);

  const handleSelectChannel = (_: any, selectChannelId: string) => {
    setSelectedChannelId(selectChannelId);
  };

  const mapMessages = (messages[selectedGuildId] || [])
    .map((message) => {
      if (
        selectedChannelId !== '' &&
        message.channel_id !== selectedChannelId
      ) {
        return undefined;
      }

      const channel = channels[message.channel_id];
      return (
        <div>
          {selectedChannelId === '' ? channel.name : ''} {message.ts}{' '}
          {message.username}: {message.content}
        </div>
      );
    })
    .filter((n) => n);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  }, [messages]);

  return (
    <div>
      <GuildsTab />
      <div css={{ display: 'flex', maxHeight: 'calc(100vh - 10.2rem)' }}>
        <Tabs
          scrollButtons
          variant="scrollable"
          orientation="vertical"
          value={selectedChannelId}
          onChange={handleSelectChannel}
          sx={{
            borderRight: 1,
            borderColor: 'divider',
            width: 150,
            flex: '0 0 12rem',
            maxHeight: '100%',
          }}
        >
          <Tab label="すべて" value="" />
          {Object.values(channels).map((channel) => (
            <Tab key={channel.id} label={channel?.name} value={channel.id} />
          ))}
        </Tabs>
        <Divider orientation="vertical" flexItem variant="fullWidth" />
        <div
          css={{
            flex: '1 1 auto',
            padding: '1rem',
            overflow: 'auto',
            maxHeight: '100%',
          }}
        >
          {mapMessages}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
