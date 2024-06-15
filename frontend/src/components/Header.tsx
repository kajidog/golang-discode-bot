import { css } from '@emotion/react';
import {
  Avatar,
  Badge,
  Box,
  CardHeader,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import { useUser } from '../app/accessToken/UserProvider';
import GraphicEqOutlinedIcon from '@mui/icons-material/GraphicEqOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useSideMenu } from '../features/menu/useSideMenu';
import ExitToAppRoundedIcon from '@mui/icons-material/ExitToAppRounded';
export interface Header {}

const styles = {
  main: css({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#fff',
  }),
  menu: css({}),
  logo: css({
    flexGrow: '1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: '.25rem',
  }),
};

export const Header: React.FC<Header> = () => {
  const { menus, changeMenu } = useSideMenu();
  const [open, setOpen] = React.useState(false);
  const [isOpenUserMenu, setIsOpenUserMenu] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const { userInfo, signOut } = useUser();
  const shapeStyles = { bgcolor: 'primary.main', width: 40, height: 40 };
  const shapeCircleStyles = { borderRadius: '50%' };
  const circle = (
    <Box
      css={{
        cursor: 'pointer',
      }}
      component="img"
      src={userInfo?.avatarURL}
      sx={{ ...shapeStyles, ...shapeCircleStyles }}
      onClick={() => {
        setIsOpenUserMenu(true);
      }}
    />
  );

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {menus.map((menu) => (
          <ListItem
            key={menu.name}
            disablePadding
            onClick={() => {
              changeMenu(menu);
            }}
          >
            <ListItemButton>
              <ListItemIcon>{menu.icon}</ListItemIcon>
              <ListItemText primary={menu.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
  const DrawerUserMenu = (
    <Box
      sx={{
        width: 200,
        height: '100%',
        bgcolor: 'rgb(20, 20, 43)',
        display: 'flex',
        flexDirection: 'column',
      }}
      role="presentation"
      onClick={() => setIsOpenUserMenu(false)}
    >
      <div>
        <CardHeader
          avatar={<Avatar src={userInfo?.avatarURL} />}
          title={userInfo?.other?.global_name}
          subheader={userInfo?.other?.username}
        />
      </div>
      <Divider />
      <div>
        <List css={{ display: 'flex', flexDirection: 'column' }}>
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                signOut();
                setIsOpenUserMenu(false);
              }}
            >
              <ListItemIcon>
                <ExitToAppRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Sign out" />
            </ListItemButton>
          </ListItem>
        </List>
      </div>
    </Box>
  );

  return (
    <div css={styles.main}>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
      <IconButton aria-label="menu" sx={{ mr: 1 }} onClick={toggleDrawer(true)}>
        <MenuOutlinedIcon />
      </IconButton>
      <div css={styles.logo}>
        <GraphicEqOutlinedIcon />
        <Typography variant="h6" component="div">
          voice-ping
        </Typography>
      </div>
      <Badge color="primary" overlap="circular">
        {circle}
      </Badge>
      <Drawer
        anchor="right"
        open={isOpenUserMenu}
        onClose={() => setIsOpenUserMenu(false)}
        variant="temporary"
      >
        {DrawerUserMenu}
      </Drawer>
    </div>
  );
};
export default Header;
