import {
  NativeSelect,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { GetGuildMembers } from '../../../wailsjs/go/bot/Bot';
import { discordgo } from '../../../wailsjs/go/models';
import { useSpeaker } from '../voicevox/useSpeaker';
import { FetchSpeakers } from '../../../wailsjs/go/app/App';
import { findObjectByKey } from '../voicevox/speakerUtils';
import { useMessages } from '../messages/useMessages';

interface GuildMembers {
  guildId: string;
}

export const GuildMembers: React.FC<GuildMembers> = ({ guildId }) => {
  const [members, setMembers] = useState<discordgo.Member[]>([]);
  const [hasBotJoined, setHasBotJoined] = useState(true);
  useMessages(guildId);
  const {
    voices,
    setVoices,
    handleChangeVoice,
    handleChangeCharacter,
    selectCharacterId,
    selectVoiceId,
  } = useSpeaker();

  useEffect(() => {
    FetchSpeakers().then(setVoices);
  }, []);

  // メンバー情報取得
  useEffect(() => {
    setHasBotJoined(true);
    guildId !== '' &&
      GetGuildMembers(guildId)
        .then(setMembers)
        .catch((err: string) => {
          if (0 <= err.indexOf(`"code": 10004`)) {
            setHasBotJoined(false);
          }
          setMembers([]);
        });
    guildId === '' && setMembers([]);
  }, [guildId]);

  const mapMember = (
    <Paper style={{ width: '100%' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>ユーザー名</TableCell>
              <TableCell>読み上げ音声</TableCell>
              <TableCell>スタイル</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow
                key={'row_' + member?.user?.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {member?.user?.global_name || member?.user?.username}
                </TableCell>
                <TableCell>
                  <NativeSelect
                    value={selectCharacterId[member?.user?.id || '']}
                    onChange={(e) => {
                      handleChangeCharacter(
                        member?.user?.id || '',
                        e.target.value || ''
                      );
                    }}
                    inputProps={{
                      name: 'キャラクター',
                      id: 'uncontrolled-server',
                    }}
                  >
                    <option value="">読み上げなし</option>

                    {voices.map((voice) => (
                      <option
                        value={voice?.speaker_uuid}
                        key={voice?.speaker_uuid}
                      >
                        {voice.name}
                      </option>
                    ))}
                  </NativeSelect>
                </TableCell>
                <TableCell>
                  <NativeSelect
                    onChange={(e) => {
                      handleChangeVoice(
                        member?.user?.id || '',
                        e.target.value || ''
                      );
                    }}
                    value={selectVoiceId[member?.user?.id || '']}
                    inputProps={{
                      name: 'スタイル',
                      id: 'uncontrolled-server',
                    }}
                  >
                    <option value="">None</option>

                    {selectCharacterId[member?.user?.id || ''] &&
                      (
                        findObjectByKey(
                          voices,
                          'speaker_uuid',
                          selectCharacterId[member?.user?.id || '']
                        )?.styles || [{ name: '不明', id: '1' }]
                      ).map((style: any) => (
                        <option value={style.id}>{style.name}</option>
                      ))}
                  </NativeSelect>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <div className="p-5">
      {hasBotJoined ? mapMember : 'ボットがこのサーバーに参加していません'}
    </div>
  );
};
