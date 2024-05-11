import { createContext } from 'react';

interface UserContext {
  checkOauthCode: (authProps: authProps) => Promise<boolean>;
  errorMessage?: string;
  reset: () => void;
  accessToken?: string;
}

export interface authProps {
  code: string;
  clientId: string;
  redirectURI: string;
  token: string;
  clientSecret: string;
}

export const UserContext = createContext<UserContext>(null!);
