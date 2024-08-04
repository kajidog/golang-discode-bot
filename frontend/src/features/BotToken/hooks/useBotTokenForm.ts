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
    // アプリのデフォルトの設定があればそれを検証し、次の画面へ
    const fetchBotConfig = async () => {
      setLoading(null);
      try {
        const config = await GetBotConfig();
        if (
          config.bot_token &&
          config.client_id &&
          config.client_secret &&
          config.redirect_uri
        ) {
          await setBotSetting(
            config.bot_token,
            config.client_id,
            config.redirect_uri,
            config.client_secret
          );
          next();
        }
      } catch (error) {
        console.error('Failed to fetch bot config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBotConfig();
  }, [setBotSetting, next]);

  // フォームサブミット時の処理
  const setBotToken = async (value: BotFormValue) => {
    setLoading(true);
    try {
      await setBotSetting(
        value.token,
        value.clientId,
        value.redirectURI,
        value.clientSecret
      );
      next(); // 例外エラーが発生しない場合は次のステップへ
    } catch (err) {
      setError('token', { message: String(err) }, { shouldFocus: true });
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
