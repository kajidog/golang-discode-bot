import { createContext } from "react";

interface BotContext {
  signOut: () => Promise<void>;
  setToken: (nextToken: string) => Promise<void>;
  token?: string | null;
  errorMessage?: string;
}

export const BotContext = createContext<BotContext>(null!);
