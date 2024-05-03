import React, { useState } from "react";
import { GetUserGuilds } from "../../../../wailsjs/go/main/App";
export function useUserGuilds() {
  const [token, setToken] = useState("");
  const [guilds, setGuilds] = useState([]);

  const fetchGuilds = async () => {
    if (token) {
      try {
        const fetchedGuilds = await GetUserGuilds(token);
        setGuilds(fetchedGuilds);
      } catch (error) {
        console.error("Error fetching guilds:", error);
      }
    }
  };

  return {
    setToken,
    fetchGuilds,
    guilds,
  };
}
