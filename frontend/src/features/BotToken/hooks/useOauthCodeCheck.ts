import React, { useEffect, useState } from 'react';
import { FetchDiscordToken } from '../../../../wailsjs/go/main/App';
import { useBot } from '../../../app/bot/BotProvider';
import { useUser } from '../../../app/accessToken/UserProvider';

export function useOauthCodeCheck() {
  const [code, setCode] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const { clientId, redirectURI, token, clientSecret } = useBot();
  const { checkOauthCode: check, errorMessage } = useUser();

  useEffect(() => {
    setIsSuccess(null);
  }, [code]);
  const checkOauthCode = async (receiveCode?: string) => {
    receiveCode && setCode(receiveCode);
    if (
      (!receiveCode && !code) ||
      !clientId ||
      !redirectURI ||
      !token ||
      !clientSecret
    ) {
      return;
    }
    setIsSuccess(null);
    const res = await check({
      code: receiveCode || code,
      clientId,
      token,
      clientSecret,
      redirectURI,
    });
    setIsSuccess(res);
  };

  return {
    code,
    setCode,
    checkOauthCode,
    isSuccess,
    errorMessage,
  };
}
