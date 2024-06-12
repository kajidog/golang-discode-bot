import { useEffect } from 'react';
import { useMessagesContext } from '../../app/messages/MessagesProvider';
import { useSpeaker } from '../voicevox/useSpeaker';
import { MessageEvent } from '../../types';
import { createGuildMessageCallback } from './messagesUtils';
import { playAudio } from '../../utils/audio';
import { useQueue } from '../../hooks/useQueue';
import { useGuilds } from '../guilds/useGuilds';
import { containsMatchingValue } from '../../utils/object';

export const useMessages = (guildId: string = '*', isSpeak: boolean = true) => {
  const { messages, registerCallback, unregisterCallback } =
    useMessagesContext();
  const { selectVoiceId } = useSpeaker();
  const { userGuilds } = useGuilds();
  const { enqueueTask } = useQueue<MessageEvent>(async (task) => {
    task.speaker && (await playAudio(task.content, String(task.speaker)));
  });

  useEffect(() => {
    // 引数のギルドIDのメッセージを受信時にしゃべる
    const handleNewMessage = createGuildMessageCallback(guildId, (message) => {
      const speaker = selectVoiceId[message.user_id];
      if (containsMatchingValue(userGuilds, 'id', message.guild_id))
        isSpeak && enqueueTask({ ...message, speaker });
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
    userGuilds,
  ]);
  return {
    messages: messages[guildId] ?? [],
  };
};
