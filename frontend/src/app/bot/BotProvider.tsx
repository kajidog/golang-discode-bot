import React, { ReactNode, useContext, useState } from "react";
import { BotContext } from "./BotContext";
import { InitializeBot } from "../../../wailsjs/go/main/App";
import { storageKeys } from "../../context/storageKeys";
export interface BotProvider {
  children: ReactNode;
}

export const BotProvider: React.FC<BotProvider> = ({ children }) => {
  const [error, setError] = useState("");
  const [token, setToken] = useState(
    localStorage.getItem(storageKeys.BOT_TOKEN) || undefined
  );
  const signOut = async () => {
    console.log("sign out");
  };

  const handleChangeToken = async (nextToken: string) => {
    try {
      await InitializeBot(nextToken);
      console.log("finish");

      setError("");
      setToken(nextToken);

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
        setToken: handleChangeToken,
        token,
        errorMessage: error,
      }}
    >
      {children}
    </BotContext.Provider>
  );
};

export const useBot = () => useContext(BotContext);
