import React, { useEffect } from 'react';
import { Breadcrumbs, Typography } from '@mui/material';
import { UserVoiceSettingTable } from '../features/sound/UserVoiceSettingTable';

export interface SoundPage {}

const style = {};
export const SoundPage: React.FC<SoundPage> = () => {
  return (
    <>
      <Typography>ユーザーの音声設定</Typography>
      <div>
        <UserVoiceSettingTable />
      </div>
    </>
  );
};

export default SoundPage;
