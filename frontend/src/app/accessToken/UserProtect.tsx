import { Link, Navigate, Outlet } from 'react-router-dom';
import { useUser } from './UserProvider';
import { useQuery } from '@tanstack/react-query';
import { GetDiscordAvatar } from '../../../wailsjs/go/app/App';
import { useEffect } from 'react';

const fetchDiscordAvatar = async (accessToken: string) => {
  const response = await GetDiscordAvatar(accessToken);
  return response;
};

export function UserProtect() {
  const { accessToken, setUserInfo, handleRefreshAccessToken } = useUser();

  const { data, error, isLoading } = useQuery({
    queryKey: ['discordAvatar', accessToken],
    queryFn: () => fetchDiscordAvatar(accessToken!),
    enabled: !!accessToken,
  });

  useEffect(() => {
    data && setUserInfo(data);
  }, [data]);

  useEffect(() => {
    error && handleRefreshAccessToken();
  }, [error]);

  // トークンが設定されてない場合は設定画面へ
  if (!accessToken) {
    return <Navigate to="/bot/token" />;
  }

  // ローディング中の表示
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // エラーハンドリング
  if (error) {
    return <div>Error loading user information</div>;
  }

  return <Outlet />;
}

export default UserProtect;
