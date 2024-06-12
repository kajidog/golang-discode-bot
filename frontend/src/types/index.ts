import { app } from '../../wailsjs/go/models';

export type MessageEvent = {
  username: string;
  user_id: string;
  content: string;
  id: string;
  speaker: string;
  guild_id: string;
};

export type UserInfo = app.UserInfo;
