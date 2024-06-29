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

export interface MessagesProviderProps {
  children: ReactNode;
}

export const MessagesProvider: React.FC<MessagesProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<{
    [guildId: string]: MessageEvent[];
  }>({});
  const callbacksRef = useRef<Set<(message: MessageEvent) => void>>(new Set());

  useEffect(() => {
    const handleMessageReceived = (message: MessageEvent) => {
      setMessages((prevMessages) => ({
        ...prevMessages,
        [message.guild_id]: [
          ...(prevMessages[message.guild_id] || []),
          message,
        ],
      }));
      callbacksRef.current.forEach((callback) => callback(message));
    };

    // Wailsからメッセージを受信
    EventsOn('messageReceived', handleMessageReceived);

    return () => {
      EventsOff('messageReceived');
    };
  }, []);

  const registerCallback = useCallback(
    (callback: (message: MessageEvent) => void) => {
      callbacksRef.current.add(callback);
    },
    []
  );

  const unregisterCallback = useCallback(
    (callback: (message: MessageEvent) => void) => {
      callbacksRef.current.delete(callback);
    },
    []
  );

  return (
    <MessagesContext.Provider
      value={{ messages, registerCallback, unregisterCallback }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessagesContext = () => useContext(MessagesContext);
