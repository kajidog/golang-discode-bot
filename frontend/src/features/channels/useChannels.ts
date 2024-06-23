import { useState } from 'react';
import { GetChannels } from '../../../wailsjs/go/bot/Bot';
import { discordgo } from '../../../wailsjs/go/models';

export const useChannels = () => {
  const [channels, setChannels] = useState<{
    [channelId: string]: discordgo.Channel;
  }>({});
  const fetchChannels = async (guildId: string) => {
    const channelArray = await GetChannels(guildId);
    let channels: { [channelId: string]: discordgo.Channel } = {};
    channelArray.forEach((channel) => {
      channels[channel.id] = channel;
    });
    setChannels(channels);
  };

  return {
    channels,
    fetchChannels,
  };
};
