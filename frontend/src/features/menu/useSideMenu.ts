import { create } from 'zustand';
import { DEFAULT_MENU, MENUS, Menu } from '../../context/menu';
import { useNavigate } from 'react-router-dom';

interface SideMenuStore {
  selectMenu: string;
  setSelectMenu: (menuName: string) => void;
}

export const useSideMenuStore = create<SideMenuStore>((set) => ({
  selectMenu: DEFAULT_MENU,
  setSelectMenu: (next) => {
    set({ selectMenu: next });
  },
}));

export const useSideMenu = () => {
  const { selectMenu, setSelectMenu } = useSideMenuStore();
  const navigate = useNavigate();
  const changeMenu = (next: Menu) => {
    setSelectMenu(next.name);
    navigate(next.path);
  };
  return { selectMenu, changeMenu, menus: MENUS };
};
