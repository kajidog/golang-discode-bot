import { useState, useEffect, useRef } from 'react';
import { Avatar, Button, Divider, Tab, Tabs, TextField } from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { GuildsTab } from '../features/guilds/GuildsTab';
import { useGuildsTab } from '../features/guilds/useGuildsTab';
import { useChannels } from '../features/channels/useChannels';
import { useMessagesContext } from '../app/messages/MessagesProvider';
import { useBot } from '../app/bot/BotProvider';
import { SendMessage } from '../../wailsjs/go/bot/Bot';

function App() {
  const { selectedGuildId } = useGuildsTab();
  const [selectedChannelId, setSelectedChannelId] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendMessage, setSendMessage] = useState('');
  const { messages } = useMessagesContext();
  const { channels, fetchChannels } = useChannels();
  const { botInfo } = useBot();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSelectedChannelId('');
    fetchChannels(selectedGuildId);
  }, [selectedGuildId]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        handleClickSendMessageButton();
      }
    };

    const textareaElement = textareaRef.current;
    textareaElement?.addEventListener('keydown', handleKeyDown);

    return () => {
      textareaElement?.removeEventListener('keydown', handleKeyDown);
    };
  }, [sendMessage]);

  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 10);
  }, [messages]);

  const handleSelectChannel = (_: any, selectedChannelId: string) => {
    setSelectedChannelId(selectedChannelId);
  };

  const handleChangeSendMessage = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setSendMessage(e.target.value);
  };

  const handleClickSendMessageButton = async () => {
    if (!selectedChannelId) return;
    setLoading(true);

    try {
      await SendMessage(selectedChannelId, sendMessage);
      setSendMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMessages = () =>
    (messages[selectedGuildId] || []).map((message) => {
      if (selectedChannelId && message.channel_id !== selectedChannelId)
        return null;

      const channel = channels[message.channel_id];
      return (
        <div key={message.id}>
          {selectedChannelId ? '' : channel?.name} {message.ts}{' '}
          {message.username}: {message.content}
        </div>
      );
    });

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
            flex: '0 0 12rem',
            maxHeight: '100%',
          }}
        >
          <Tab label="すべて" value="" />
          {Object.values(channels).map((channel) => (
            <Tab
              key={channel.id}
              label={channel?.name}
              value={String(channel.id)}
            />
          ))}
        </Tabs>
        <Divider orientation="vertical" flexItem variant="fullWidth" />
        <div
          css={{
            flex: '1 1 auto',
            padding: '.5rem 1rem .25rem',
            overflow: 'auto',
            maxHeight: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div css={{ flex: '1 1 auto' }}>
            {renderMessages()}
            <div ref={messagesEndRef} />
          </div>
          <div css={{ flex: '0 0', display: 'flex', gap: '1rem' }}>
            <Avatar sizes="5rem" src={botInfo?.avatarURL} />
            <div
              css={{
                width: '100%',
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column',
                alignItems: 'flex-end',
              }}
            >
              <TextField
                fullWidth
                multiline
                rows={4}
                value={sendMessage}
                onChange={handleChangeSendMessage}
                inputRef={textareaRef}
                disabled={selectedChannelId === ''}
                placeholder="ボットとしてメッセージを送信"
              />
              <div>
                <Button
                  color="primary"
                  endIcon={<SendRoundedIcon />}
                  onClick={handleClickSendMessageButton}
                  disabled={loading || selectedChannelId === ''}
                >
                  送信
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
