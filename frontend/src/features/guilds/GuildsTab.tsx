import { Box, Tab, Tabs } from '@mui/material';
import { useGuilds } from './useGuilds';
import { useGuildsTab } from './useGuildsTab';

export const GuildsTab = () => {
  const { selectedGuildId, handleChangeServer } = useGuildsTab();
  const { userGuilds } = useGuilds();

  return (
    <Tabs
      scrollButtons
      allowScrollButtonsMobile
      value={selectedGuildId}
      textColor="primary"
      indicatorColor="secondary"
      onChange={handleChangeServer}
    >
      {userGuilds.map((guild) => (
        <Tab
          icon={<CircleIcon src={guild.iconURL} />}
          iconPosition="start"
          label={guild?.name}
          value={guild.id}
          key={guild.id}
        />
      ))}
    </Tabs>
  );
};
const shapeStyles = {
  bgcolor: 'primary.main',
  width: 25,
  height: 25,
  mr: 0.75,
};
const shapeCircleStyles = { borderRadius: '7px' };

const CircleIcon = ({ src }: { src: string }) => {
  return (
    <Box
      component="img"
      src={src}
      sx={{ ...shapeStyles, ...shapeCircleStyles }}
    />
  );
};
