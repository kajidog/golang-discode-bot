import { useEffect, useState } from 'react';
import { storageKeys } from '../../../context/storageKeys';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { gptSchema } from '../schemas';
import { InitializeGPT } from '../../../../wailsjs/go/app/App';

export const useChatGPT = () => {
  const [gptToken, setGptToken] = useState(
    localStorage.getItem(storageKeys.GPT_TOKEN) || undefined
  );

  useEffect(() => {
    if (gptToken) {
      InitializeGPT(gptToken);
    }
  }, [gptToken]);
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

  const handleChangeGptToken = (nextToken: { gptToken: string }) => {
    setGptToken(nextToken.gptToken);
    localStorage.setItem(storageKeys.GPT_TOKEN, nextToken.gptToken);
  };

  return {
    gptToken,
    handleChangeGptToken: handleSubmit(handleChangeGptToken),
    register,
    errors,
  };
};
