import { css } from '@emotion/react';
import React from 'react';
import { Card } from '@mui/material';
import { useSideMenu } from '../features/menu/useSideMenu';

export interface SideMenu {
  select?: string;
}

const style = css({
  height: '100%',
});

const item = css({
  marginBottom: '1rem',
  padding: '.5rem',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  transition: '.2s',
});
const selectedMenu = css({
  color: '#fff',
});

export const SideMenu: React.FC<SideMenu> = () => {
  const { selectMenu, changeMenu, menus } = useSideMenu();
  const mapMenus = menus.map((menu) => {
    const Icon = menu.icon;
    if (selectMenu === menu.name) {
      return (
        <Card css={[item, selectedMenu]} key={'side_icon_' + menu.name}>
          <div>{menu.icon}</div>
        </Card>
      );
    }
    return (
      <div
        css={item}
        key={'side_icon_' + menu.name}
        onClick={() => {
          changeMenu(menu);
        }}
      >
        <div>{menu.icon}</div>
      </div>
    );
  });
  return <div css={style}>{mapMenus}</div>;
};
export default SideMenu;
