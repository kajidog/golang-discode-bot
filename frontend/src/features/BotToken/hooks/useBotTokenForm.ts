import { useForm } from "react-hook-form";
import { useBot } from "../../../app/bot/BotProvider";
import { BotFormValue, tokenSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

export const useBotTokenForm = ({ next }: { next: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { setBotSetting, token, clientId, redirectURI, clientSecret } =
    useBot();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: token ?? "",
      clientId: clientId ?? "",
      clientSecret: clientSecret ?? "",
      redirectURI: redirectURI ?? "",
    },
  });

  const setBotToken = async (value: BotFormValue) => {
    try {
      setLoading(true);
      await setBotSetting(
        value.token,
        value.clientId,
        value.redirectURI,
        value.clientSecret
      );
      next();
    } catch (err) {
      setError(
        "token",
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
