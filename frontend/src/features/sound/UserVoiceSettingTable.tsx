import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  css,
} from '@mui/material';
import { useSpeaker } from '../voicevox/useSpeaker';
import { useGuildMembers } from '../guilds/useGuildMembers';
import { useGuildsTab } from '../guilds/useGuildsTab';
import { UserVoiceSettingRow } from './UserVoiceSettingRow';
import { GuildsTab } from '../guilds/GuildsTab';

const style = {
  content: css({
    paddingTop: '.75rem',
  }),
};

export const UserVoiceSettingTable = () => {
  const { selectedGuildId: guildId } = useGuildsTab();

  const {
    voices,
    setVoices,
    handleChangeVoice,
    handleChangeCharacter,
    selectCharacterId,
    selectVoiceId,
  } = useSpeaker();

  const { members, hasBotJoined } = useGuildMembers(guildId);

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
              <UserVoiceSettingRow
                key={'row_' + member?.user?.id}
                {...{
                  member,
                  voices,
                  setVoices,
                  handleChangeVoice,
                  handleChangeCharacter,
                  selectCharacterId,
                  selectVoiceId,
                }}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );

  return (
    <div>
      <div>
        <GuildsTab />
      </div>
      <div css={style.content}>
        {hasBotJoined ? mapMember : 'ボットがこのサーバーに参加していません'}
      </div>
    </div>
  );
};
