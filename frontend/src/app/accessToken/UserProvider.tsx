import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { UserContext, authProps } from './UserContext';
import { storageKeys } from '../../context/storageKeys';
import {
  FetchDiscordToken,
  RefreshDiscordToken,
} from '../../../wailsjs/go/app/App';
import { UserInfo } from '../../types';
import { useBot } from '../bot/BotProvider';
export interface UserProvider {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProvider> = ({ children }) => {
  const { clientId, clientSecret } = useBot();
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState<UserInfo>();
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

  const signOut = () => {
    reset();
  };

  const handleRefreshAccessToken = async () => {
    if (!clientId || !clientSecret || !refreshToken) {
      return;
    }
    const { access_token, refresh_token } = await RefreshDiscordToken(
      clientId!,
      clientSecret!,
      refreshToken!
    );
    if (!access_token || !refresh_token) {
      throw new Error('Access token notfound');
    }
    setAccessToken(access_token);
    localStorage.setItem(storageKeys.USER_ACCESS_TOKEN, access_token);

    setRefreshToken(refresh_token);
    localStorage.setItem(storageKeys.USER_REFRESH_TOKEN, refresh_token);
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
        userInfo,
        setUserInfo,
        errorMessage: error,
        reset,
        accessToken,
        checkOauthCode,
        signOut,
        handleRefreshAccessToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
