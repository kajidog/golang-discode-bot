import { create } from 'zustand';
import { findObjectByKey } from './speakerUtils';

interface SpeakerStore {
  voices: any[];
  setVoices: (next: any[]) => void;
  selectCharacterId: { [memberId: string]: string }; // 選択中のVoicevoxのキャラクター
  setSelectCharacterId: (memberId: string, voiceId: string) => void;
  selectVoiceId: { [memberId: string]: string }; // VoiceVoxにしゃべらすID
  setSelectVoiceId: (memberId: string, voiceId: string) => void;
}

export const useSpeakerStore = create<SpeakerStore>((set) => ({
  voices: [],
  setVoices: (next) => set(() => ({ voices: next })),
  selectCharacterId: JSON.parse(localStorage.getItem('characterID') || '{}'),
  setSelectCharacterId: (memberId: string, characterId: string) => {
    set(({ selectCharacterId, voices, selectVoiceId }) => {
      const nextSelectCharacterId = {
        ...selectCharacterId,
        [memberId]: characterId,
      };
      localStorage.setItem(
        'characterID',
        JSON.stringify(nextSelectCharacterId)
      );
      const nextSelectVoiceId = {
        ...selectVoiceId,
        [memberId]:
          findObjectByKey(voices, 'speaker_uuid', characterId)?.styles[0].id ||
          '',
      };
      localStorage.setItem('voiceID', JSON.stringify(nextSelectVoiceId));
      return {
        selectCharacterId: nextSelectCharacterId,
        selectVoiceId: nextSelectVoiceId,
      };
    });
  },
  selectVoiceId: JSON.parse(localStorage.getItem('voiceID') || '{}'),
  setSelectVoiceId: (memberId: string, voiceId: string) =>
    set(({ selectVoiceId }) => {
      const next = { ...selectVoiceId, [memberId]: voiceId };
      localStorage.setItem('voiceID', JSON.stringify(next));
      return { selectVoiceId: next };
    }),
}));

// voiceboxのspeaker使う
export const useSpeaker = () => {
  const {
    setVoices,
    voices,
    setSelectCharacterId,
    setSelectVoiceId,
    selectCharacterId,
    selectVoiceId,
  } = useSpeakerStore();

  // 選択中のキャラクター変更
  const handleChangeCharacter = (id: string, speaker: string) => {
    setSelectVoiceId(id, speaker); // スピーカーもデフォルトに変更
    setSelectCharacterId(id, speaker);
  };

  // 選択中のSpeaker変更
  const handleChangeVoice = setSelectVoiceId;

  return {
    voices,
    setVoices,
    handleChangeVoice,
    handleChangeCharacter,
    selectCharacterId,
    selectVoiceId,
  };
};
