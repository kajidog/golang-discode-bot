import { MessageEvent } from '../../types';

export const createGuildMessageCallback = (
  guildId: string,
  callback: (message: MessageEvent) => void
) => {
  return (message: MessageEvent) => {
    if (message.guild_id === guildId || guildId === '*') {
      callback(message);
    }
  };
};
