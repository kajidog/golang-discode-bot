import { createContext } from "react";

interface BotContext {
  signOut: () => Promise<void>;
  setBotSetting: (
    nextToken: string,
    clientId: string,
    redirectURI: string
  ) => Promise<void>;
  setUserToken: (nextUserToken: string) => void;
  token?: string | null;
  userToken?: string | null;
  clientId?: string | null;
  redirectURI?: string | null;
  errorMessage?: string;
  reset?: () => void;
}

export const BotContext = createContext<BotContext>(null!);
