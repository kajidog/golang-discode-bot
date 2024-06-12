import { Link, Navigate, Outlet } from 'react-router-dom';
import { useUser } from './UserProvider';
import { useEffect, useState } from 'react';
import { GetDiscordAvatar } from '../../../wailsjs/go/app/App';

export function UserProtect() {
  const { accessToken, setUserInfo } = useUser();
  const [loading, setLading] = useState<boolean | null>(false);
  useEffect(() => {
    setLading(true);
    if (accessToken) {
      GetDiscordAvatar(accessToken)
        .then(setUserInfo)
        .finally(() => {
          setLading(false);
        });
    } else {
      setLading(false);
    }
  }, []);
  // トークンが設定されてない場合は設定画面へ
  if (!accessToken) {
    return <Navigate to="/bot/token" />;
  }
  if (loading || loading === null) {
    return <div>loading</div>;
  }

  return <Outlet />;
}

export default UserProtect;
