export const DISCORD_AUTHORIZE_URI = ({
  clientId,
  redirectURI,
}: {
  clientId: string;
  redirectURI: string;
}) =>
  `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectURI}&response_type=code&scope=identify+guilds`;
