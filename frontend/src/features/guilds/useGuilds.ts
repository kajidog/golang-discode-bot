import { useUser } from '../../app/accessToken/UserProvider';
import { GetGuilds } from '../../../wailsjs/go/bot/Bot';
import { GetUserGuilds } from '../../../wailsjs/go/app/App';
import { app } from '../../../wailsjs/go/models';
import { create } from 'zustand';

export interface GuildsStore {
  userGuilds: app.UserGuildWithIcon[];
  botGuilds: app.UserGuildWithIcon[];
  setUserGuilds: (guilds: app.UserGuildWithIcon[]) => void;
  setBotGuilds: (guilds: app.UserGuildWithIcon[]) => void;
}
export const useGuildsStore = create<GuildsStore>((set) => ({
  userGuilds: [],
  botGuilds: [],
  setUserGuilds: (guilds) => set({ userGuilds: guilds }),
  setBotGuilds: (guilds) => set({ botGuilds: guilds }),
}));

export const useGuilds = () => {
  const { accessToken } = useUser();
  const { setUserGuilds, setBotGuilds, userGuilds, botGuilds } =
    useGuildsStore();

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
