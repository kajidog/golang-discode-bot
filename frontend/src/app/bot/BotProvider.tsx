import React, { ReactNode, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { BotContext } from './BotContext';
import { InitializeBot } from '../../../wailsjs/go/bot/Bot';
import { storageKeys } from '../../context/storageKeys';
import { bot } from '../../../wailsjs/go/models';

export interface BotProviderProps {
  children: ReactNode;
}

export const BotProvider: React.FC<BotProviderProps> = ({ children }) => {
  const [botInfo, setBotInfo] = useState<bot.BotInfo>({
    username: '',
    avatarURL: '',
  });
  const [error, setError] = useState('');
  const [token, setToken] = useState(Cookies.get(storageKeys.BOT_TOKEN));
  const [userToken, setUserToken] = useState(
    Cookies.get(storageKeys.USER_TOKEN)
  );
  const [clientId, setClientId] = useState(
    Cookies.get(storageKeys.BOT_CLIENT_ID)
  );
  const [clientSecret, setClientSecret] = useState(
    Cookies.get(storageKeys.BOT_CLIENT_SECRET)
  );
  const [redirectURI, setRedirectURI] = useState(
    Cookies.get(storageKeys.BOT_REDIRECT_URI)
  );

  const reset = () => {
    Cookies.remove(storageKeys.BOT_TOKEN);
    setToken(undefined);
  };

  const signOut = async () => {
    console.log('sign out');
  };

  const handleChangeUserToken = (nextToken: string) => {
    setUserToken(nextToken);
    Cookies.set(storageKeys.USER_TOKEN, nextToken);
  };

  const handleChangeToken = async (
    nextToken: string,
    clientId: string,
    redirectURI: string,
    clientSecret: string
  ) => {
    try {
      console.log(nextToken, clientId, redirectURI);

      await InitializeBot(nextToken);

      setError('');
      setToken(nextToken);
      setClientId(clientId);
      setClientSecret(clientSecret);
      setRedirectURI(redirectURI);
      Cookies.set(storageKeys.BOT_TOKEN, nextToken);
      Cookies.set(storageKeys.BOT_CLIENT_ID, clientId);
      Cookies.set(storageKeys.BOT_CLIENT_SECRET, clientSecret);
      Cookies.set(storageKeys.BOT_REDIRECT_URI, redirectURI);

      return;
    } catch (error) {
      setError(String(error));
      throw error;
    }
  };

  return (
    <BotContext.Provider
      value={{
        signOut,
        setBotSetting: handleChangeToken,
        botInfo,
        setBotInfo,
        token,
        redirectURI,
        clientId,
        clientSecret,
        userToken,
        errorMessage: error,
        reset,
        setUserToken: handleChangeUserToken,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBot = () => useContext(BotContext);
