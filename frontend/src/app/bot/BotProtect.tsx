import { Link, Navigate, Outlet } from "react-router-dom";
import { useBot } from "./BotProvider";

export function Protect() {
  const { token } = useBot();

  // トークンが設定されてない場合は設定画面へ
  if (!token) {
    return <Navigate to="/bot/token" />;
  }

  return <Outlet />;
}

export default Protect;
