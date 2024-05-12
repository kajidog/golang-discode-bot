import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { UserContext, authProps } from './UserContext';
import { storageKeys } from '../../context/storageKeys';
import { FetchDiscordToken } from '../../../wailsjs/go/app/App';
export interface UserProvider {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProvider> = ({ children }) => {
  const [error, setError] = useState('');
  const [accessToken, setAccessToken] = useState(
    localStorage.getItem(storageKeys.USER_ACCESS_TOKEN) || undefined
  );
  const [refreshToken, setRefreshToken] = useState(
    localStorage.getItem(storageKeys.USER_REFRESH_TOKEN) || undefined
  );

  const reset = () => {
    localStorage.removeItem(storageKeys.USER_ACCESS_TOKEN);
    setAccessToken(undefined);
  };

  // アクセストークンを取得
  const checkOauthCode = async ({
    code,
    clientId,
    clientSecret,
    redirectURI,
  }: authProps) => {
    setError('');
    try {
      const res = await FetchDiscordToken(
        clientId,
        clientSecret,
        code,
        redirectURI
      );
      const fetchedGuilds = JSON.parse(res);
      const accessToken = fetchedGuilds?.access_token ?? null;
      const refresh_token = fetchedGuilds?.refresh_token ?? null;
      setAccessToken(accessToken);
      localStorage.setItem(storageKeys.USER_ACCESS_TOKEN, accessToken);

      setRefreshToken(refresh_token);
      localStorage.setItem(storageKeys.USER_REFRESH_TOKEN, refresh_token);

      if (fetchedGuilds?.error_description) {
        setError(fetchedGuilds?.error_description);
        return false;
      }
      return !!accessToken && !!refresh_token;
    } catch (error) {
      setError(String(error));
      console.error(error);
      return false;
    }
  };
  return (
    <UserContext.Provider
      value={{
        errorMessage: error,
        reset,
        accessToken,
        checkOauthCode,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
