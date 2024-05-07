import React, { useState } from "react";
import { FetchDiscordToken } from "../../../../wailsjs/go/main/App";
import { useBot } from "../../../app/bot/BotProvider";

export function useOauthCodeCheck() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<any>({});
  const { clientId, redirectURI, token } = useBot();

  const checkOauthCode = async () => {
    if (code && clientId && redirectURI && token) {
      try {
        const fetchedGuilds = await FetchDiscordToken(
          clientId,
          "7Vz642tgeQOoBOa5dqK-io7M4bgRISbz",
          code,
          redirectURI
        );
        setResult(JSON.stringify(fetchedGuilds));
      } catch (error) {
        console.error("Error fetching guilds:", error);
      }
    }
  };

  return {
    code,
    setCode,
    checkOauthCode,
    result,
  };
}
