import React, {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { MessagesContext } from './MessagesContext';
import { EventsOff, EventsOn } from '../../../wailsjs/runtime/runtime';
import { MessageEvent } from '../../types';

export interface MessagesProvider {
  children: ReactNode;
}

export const MessagesProvider: React.FC<MessagesProvider> = ({ children }) => {
  const [messages, setMessages] = useState<{
    [guildId: string]: MessageEvent[];
  }>({});
  const callbacksRef = useRef<Set<(message: MessageEvent) => void>>(new Set());

  useEffect(() => {
    // Wailsからメッセージを受信
    EventsOn('messageReceived', (message: MessageEvent) => {
      setMessages((prevMessages) => ({
        [message.guild_id]: [
          ...(prevMessages[message.guild_id] || []),
          { ...message },
        ],
      }));
      callbacksRef.current.forEach((callback) => callback(message));
    });
    return () => {
      EventsOff('messageReceived');
    };
  }, []);

  // 各コンポーネントでメッセージ受信のコールバック設定
  const registerCallback = useCallback(
    (callback: (message: MessageEvent) => void) => {
      callbacksRef.current.add(callback);
    },
    []
  );

  // 各コンポーネントでメッセージ受信のコールバック解除
  const unregisterCallback = useCallback(
    (callback: (message: MessageEvent) => void) => {
      callbacksRef.current.delete(callback);
    },
    []
  );

  return (
    <MessagesContext.Provider
      value={{
        messages,
        registerCallback,
        unregisterCallback,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessagesContext = () => useContext(MessagesContext);
