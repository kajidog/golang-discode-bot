import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import LyricsRoundedIcon from '@mui/icons-material/LyricsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import { ReactNode } from 'react';
export interface Menu {
  name: string;
  icon: ReactNode;
  path: string;
}
export const MENUS: Menu[] = [
  {
    name: 'ホーム',
    path: '/',
    icon: <HomeRoundedIcon></HomeRoundedIcon>,
  },
  {
    name: '音声',
    path: '/sound',
    icon: <LyricsRoundedIcon></LyricsRoundedIcon>,
  },
  {
    name: '設定',
    path: '/setting',
    icon: <SettingsRoundedIcon></SettingsRoundedIcon>,
  },
  {
    name: 'chat-gpt',
    path: '/gpt',
    icon: <SmartToyRoundedIcon></SmartToyRoundedIcon>,
  },
];

export const DEFAULT_MENU = MENUS[0].name;
