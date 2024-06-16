import { Link, Navigate, Outlet } from 'react-router-dom';
import { useBot } from './BotProvider';
import { useEffect, useState } from 'react';
import { InitializeBot } from '../../../wailsjs/go/bot/Bot';
import { bot } from '../../../wailsjs/go/models';

export function Protect() {
  const { token, setBotInfo, botInfo } = useBot();
  const [loading, setLading] = useState<boolean | null>(null);
  useEffect(() => {
    if (loading) {
      return;
    }
    setLading(true);
    if (!token || botInfo.username !== '') {
      setLading(false);
      return;
    }
    InitializeBot(token)
      .then(setBotInfo)
      .finally(() => {
        setLading(false);
      });
  }, []);

  // トークンが設定されてない場合は設定画面へ
  if (!token) {
    return <Navigate to="/bot/token" />;
  }
  if (loading || loading === null) {
    return <div>loading</div>;
  }

  return <Outlet />;
}

export default Protect;
