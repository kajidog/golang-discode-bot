import { css } from '@emotion/react';
import React from 'react';
import UserDictionaryTable from '../../features/settings/UserDictionaryTable';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  LoadSettings,
  OpenSettingsFile,
} from '../../../wailsjs/go/settings/Settings';

export interface UserDictionary {}

const style = css`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  background-image: url('/src/assets/undraw_graduation_re_gthn.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  flex-direction: column;
`;
const contentStyle = css`
  padding: 0rem 1rem;
  width: 100%;
`;
export const UserDictionary: React.FC<UserDictionary> = () => {
  const navigate = useNavigate();
  return (
    <div css={style}>
      <div className="p-5 flex gap-2">
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/')}
        >
          戻る
        </Button>
        <Button variant="outlined" onClick={() => OpenSettingsFile()}>
          設定ファイルを表示
        </Button>
        <Button variant="outlined" onClick={() => LoadSettings()}>
          設定を再読み込み
        </Button>
      </div>
      <div css={contentStyle}>
        <UserDictionaryTable />
      </div>
    </div>
  );
};

export default UserDictionary;
