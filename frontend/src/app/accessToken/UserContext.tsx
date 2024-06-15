import { createContext } from 'react';
import { UserInfo } from '../../types';

interface UserContext {
  userInfo?: UserInfo;
  setUserInfo: (userInfo: UserInfo) => void;
  checkOauthCode: (authProps: authProps) => Promise<boolean>;
  errorMessage?: string;
  reset: () => void;
  accessToken?: string;
  signOut: () => void;
}

export interface authProps {
  code: string;
  clientId: string;
  redirectURI: string;
  token: string;
  clientSecret: string;
}

export const UserContext = createContext<UserContext>(null!);
