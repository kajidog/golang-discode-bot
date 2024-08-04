import { Navigate, Outlet } from 'react-router-dom';
import { useBot } from './BotProvider';
import { useQuery } from '@tanstack/react-query';
import { InitializeBot } from '../../../wailsjs/go/bot/Bot';
import { useEffect } from 'react';

// API呼び出し関数
const fetchBotInfo = async (token: string) => {
  return InitializeBot(token);
};

export function Protect() {
  const { token, setBotInfo, botInfo } = useBot();

  // React Queryを使用してデータフェッチを管理
  const { data, error, isLoading } = useQuery({
    queryKey: ['botInfo', token],
    queryFn: () => fetchBotInfo(token!),
    enabled: !!token && botInfo.username === '', // tokenが存在し、botInfoが未設定の場合にのみフェッチを実行,
  });

  useEffect(() => {
    if (data) {
      setBotInfo(data);
    }
  }, [data]);

  // トークンが設定されてない場合は設定画面へ
  if (!token) {
    return <Navigate to="/bot/token" />;
  }

  // ローディング中の表示
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // エラーハンドリング
  if (error) {
    return <Navigate to="/bot/token" />;
  }

  return <Outlet />;
}

export default Protect;
