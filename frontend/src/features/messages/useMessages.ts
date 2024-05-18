import { useEffect } from 'react';
import { useMessagesContext } from '../../app/messages/MessagesProvider';
import { useSpeaker } from '../voicevox/useSpeaker';
import { MessageEvent } from '../../types';
import { createGuildMessageCallback } from './messagesUtils';
import { playAudio } from '../../utils/audio';
import { useQueue } from '../../hooks/useQueue';

export const useMessages = (guildId: string, isSpeak?: string) => {
  const { messages, registerCallback, unregisterCallback } =
    useMessagesContext();
  const { selectVoiceId } = useSpeaker();
  const { enqueueTask } = useQueue<MessageEvent>(async (task) => {
    await playAudio(task.content, String(task.speaker || '6'));
  });

  useEffect(() => {
    // 引数のギルドIDのメッセージを受信時にしゃべる
    const handleNewMessage = createGuildMessageCallback(guildId, (message) => {
      const speaker = selectVoiceId[message.user_id];
      enqueueTask({ ...message, speaker });
    });

    registerCallback(handleNewMessage);
    return () => {
      unregisterCallback(handleNewMessage);
    };
  }, [
    guildId,
    selectVoiceId,
    enqueueTask,
    registerCallback,
    unregisterCallback,
  ]);
  return {
    messages: messages[guildId] ?? [],
  };
};
