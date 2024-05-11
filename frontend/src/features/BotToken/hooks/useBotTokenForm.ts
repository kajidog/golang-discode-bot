import { useForm } from 'react-hook-form';
import { useBot } from '../../../app/bot/BotProvider';
import { BotFormValue, tokenSchema } from '../schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { GetBotConfig } from '../../../../wailsjs/go/main/Config';

// DiscordBot設定
export const useBotTokenForm = ({ next }: { next: () => void }) => {
  const [loading, setLoading] = useState<boolean | null>(null); // 通信中フラグ
  const { setBotSetting, token, clientId, redirectURI, clientSecret } =
    useBot(); // コンテキスト使用

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: token ?? '',
      clientId: clientId ?? '',
      clientSecret: clientSecret ?? '',
      redirectURI: redirectURI ?? '',
    },
  });

  useEffect(() => {
    GetBotConfig().then((config) => {
      setLoading(null);
      if (
        config.bot_token &&
        config.client_id &&
        config.client_secret &&
        config.redirect_uri
      ) {
        setBotSetting(
          config.bot_token,
          config.client_id,
          config.redirect_uri,
          config.client_secret
        )
          .then(next)
          .catch()
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  // フォームサブミット時の処理
  const setBotToken = async (value: BotFormValue) => {
    try {
      // 通信中状態にし、コンテキストにフォーム内容を渡し、Go側でDiscordの認証を行う
      setLoading(true);
      await setBotSetting(
        value.token,
        value.clientId,
        value.redirectURI,
        value.clientSecret
      );

      next(); // 例外エラーが発生しない場合は次のステップへ
    } catch (err) {
      setError(
        'token',
        {
          message: String(err),
        },
        {
          shouldFocus: true,
        }
      );
    } finally {
      setLoading(false);
    }
  };
  return {
    register,
    handleSubmit: handleSubmit(setBotToken),
    errors,
    loading,
  };
};
