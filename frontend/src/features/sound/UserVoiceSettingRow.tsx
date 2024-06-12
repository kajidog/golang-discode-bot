import { NativeSelect, TableCell, TableRow } from '@mui/material';
import { discordgo } from '../../../wailsjs/go/models';
import { useSpeaker } from '../voicevox/useSpeaker';
import { findObjectByKey } from '../voicevox/speakerUtils';

type useSpeakerType = ReturnType<typeof useSpeaker>;
interface UserVoiceSettingRow {
  member: discordgo.Member;
  selectCharacterId: useSpeakerType['selectCharacterId'];
  handleChangeCharacter: useSpeakerType['handleChangeCharacter'];
  handleChangeVoice: useSpeakerType['handleChangeVoice'];
  selectVoiceId: useSpeakerType['selectVoiceId'];
  voices: useSpeakerType['voices'];
}

export const UserVoiceSettingRow: React.FC<UserVoiceSettingRow> = ({
  member,
  selectCharacterId,
  selectVoiceId,
  handleChangeCharacter,
  voices,
  handleChangeVoice,
}) => {
  return (
    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row">
        {member?.user?.global_name || member?.user?.username}
      </TableCell>
      <TableCell>
        <NativeSelect
          value={selectCharacterId[member?.user?.id || '']}
          onChange={(e) => {
            handleChangeCharacter(member?.user?.id || '', e.target.value || '');
          }}
          inputProps={{
            name: 'キャラクター',
            id: 'uncontrolled-server',
          }}
        >
          <option value="">読み上げなし</option>

          {voices.map((voice) => (
            <option value={voice?.speaker_uuid} key={voice?.speaker_uuid}>
              {voice.name}
            </option>
          ))}
        </NativeSelect>
      </TableCell>
      <TableCell>
        <NativeSelect
          onChange={(e) => {
            handleChangeVoice(member?.user?.id || '', e.target.value || '');
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
  );
};
