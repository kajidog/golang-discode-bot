import { createContext } from 'react';
import { MessageEvent } from '../../types';

interface MessagesContext {
  messages: { [guildId: string]: MessageEvent[] };
  registerCallback: (callback: (message: MessageEvent) => void) => void;
  unregisterCallback: (callback: (message: MessageEvent) => void) => void;
}

export const MessagesContext = createContext<MessagesContext>(null!);
