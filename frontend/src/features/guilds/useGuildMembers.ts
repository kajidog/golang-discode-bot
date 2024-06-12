import { useEffect, useState } from 'react';
import { discordgo } from '../../../wailsjs/go/models';
import { GetGuildMembers } from '../../../wailsjs/go/bot/Bot';

export const useGuildMembers = (guildId: string) => {
  const [members, setMembers] = useState<discordgo.Member[]>([]);
  const [hasBotJoined, setHasBotJoined] = useState(true);
  const [loading, setLoading] = useState(true);

  // メンバー情報取得
  useEffect(() => {
    if (guildId !== '') {
      setLoading(true);
      GetGuildMembers(guildId)
        .then((members) => {
          setMembers(members);
          setHasBotJoined(true);
        })
        .catch((err: string) => {
          if (0 <= err.indexOf(`"code": 10004`)) {
            setHasBotJoined(false);
          }
          setMembers([]);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setMembers([]);
    }
  }, [guildId]);

  return {
    members,
    loading,
    hasBotJoined,
  };
};
