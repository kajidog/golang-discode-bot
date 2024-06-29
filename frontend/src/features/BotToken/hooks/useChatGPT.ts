import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { storageKeys } from '../../../context/storageKeys';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { gptSchema } from '../schemas';
import { InitializeGPT } from '../../../../wailsjs/go/app/App';
import { useMutation } from '@tanstack/react-query';

// ChatGPT設定のカスタムフック
export const useChatGPT = () => {
  const [gptToken, setGptToken] = useState<string | undefined>(
    Cookies.get(storageKeys.GPT_TOKEN)
  );

  // gptTokenの変更を監視して、変更があればInitializeGPTを呼び出す
  useEffect(() => {
    if (gptToken) {
      InitializeGPT(gptToken);
    }
  }, [gptToken]);

  // React Hook Formの設定
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(gptSchema),
    defaultValues: {
      gptToken: gptToken ?? '',
    },
  });

  // GPTトークンの変更を処理するミューテーション
  const mutation = useMutation({
    mutationFn: async (nextToken: { gptToken: string }) => {
      Cookies.set(storageKeys.GPT_TOKEN, nextToken.gptToken);
      setGptToken(nextToken.gptToken);
      await InitializeGPT(nextToken.gptToken);
    },
    onError: (error: Error) => {
      console.error('Failed to initialize GPT:', error);
    },
  });

  // フォームサブミット時の処理
  const handleChangeGptToken = handleSubmit(
    (nextToken: { gptToken: string }) => {
      mutation.mutate(nextToken);
    }
  );

  return {
    gptToken,
    handleChangeGptToken,
    register,
    errors,
  };
};
