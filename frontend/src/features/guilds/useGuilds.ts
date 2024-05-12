import { useState } from 'react';
import { useUser } from '../../app/accessToken/UserProvider';
import { GetGuilds } from '../../../wailsjs/go/bot/Bot';
import { GetUserGuilds } from '../../../wailsjs/go/app/App';
import { discordgo } from '../../../wailsjs/go/models';
import { useBot } from '../../app/bot/BotProvider';

export const useGuilds = () => {
  const { accessToken } = useUser();
  const { token } = useBot();
  const [userGuilds, setUserGuilds] = useState<discordgo.UserGuild[]>([]);
  const [botGuilds, setBotGuilds] = useState<discordgo.UserGuild[]>([]);
  const fetchUserGuilds = async () => {
    if (!accessToken) {
      return;
    }
    const guilds = await GetUserGuilds(accessToken).catch(alert);
    setUserGuilds(guilds || []);
  };

  const fetchBotGuilds = async () => {
    const guilds = await GetGuilds();
    setBotGuilds(guilds);
  };

  return {
    fetchUserGuilds,
    fetchBotGuilds,
    userGuilds,
    botGuilds,
  };
};
