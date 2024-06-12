import { SyntheticEvent, useState } from 'react';
import { storageKeys } from '../../context/storageKeys';
import { create } from 'zustand';

interface GuildsTabStore {
  selectedGuildId: string;
  changeSelectedGuildId: (nextGuildId: string) => void;
}

export const useGuildsTabStore = create<GuildsTabStore>((set) => ({
  selectedGuildId: localStorage.getItem(storageKeys.SELECT_GUILD_ID) || '',
  changeSelectedGuildId: (next) => {
    set({
      selectedGuildId: next,
    });
    localStorage.setItem(storageKeys.SELECT_GUILD_ID, next);
  },
}));

export const useGuildsTab = () => {
  const { selectedGuildId, changeSelectedGuildId } = useGuildsTabStore();

  // 表示するサーバ変更
  const handleChangeServer = (
    _: SyntheticEvent<Element, Event>,
    value: any
  ) => {
    changeSelectedGuildId(String(value));
  };

  return {
    selectedGuildId,
    handleChangeServer,
  };
};
