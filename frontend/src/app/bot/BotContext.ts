import { createContext } from 'react';
import { bot } from '../../../wailsjs/go/models';

interface BotContext {
  signOut: () => Promise<void>;
  setBotSetting: (
    nextToken: string,
    clientId: string,
    redirectURI: string,
    clientSecret: string
  ) => Promise<void>;
  botInfo: bot.BotInfo;
  setBotInfo: (bot: bot.BotInfo) => void;
  setUserToken: (nextUserToken: string) => void;
  token?: string | null;
  userToken?: string | null;
  clientId?: string | null;
  clientSecret?: string | null;
  redirectURI?: string | null;
  errorMessage?: string;
  reset?: () => void;
}

export const BotContext = createContext<BotContext>(null!);
