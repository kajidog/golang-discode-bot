import { useEffect } from "react";
import {  Link } from "react-router-dom";
import { Route, Routes, useLocation, useSearchParams } from "react-router-dom";

function App() {
  const location = useLocation();

  useEffect(() => {
    const w = window as any;
    if (w.dataLayer) {
      w.dataLayer.push({
        event: 'pageview',
        page: location.pathname + location.search
      });
    }
  }, [location]);


  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // ここでカスタムURLスキームを使ってアプリにコードを送る
      // 例: yourapp://auth?code=YOUR_AUTH_CODE
      window.location.href = `voiceping://auth?code=${code}`;
    }
  }, [searchParams]);

  return (
    <>
        <nav>
          <ul>
            <li>
              <Link to="/golang-discode-bot/">Home</Link>
            </li>
            <li>
              <Link to="/golang-discode-bot/about">About</Link>
            </li>
            <li>
              <Link to="/golang-discode-bot/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/golang-discode-bot/" element={<>ほめ</>} />
          <Route path="/golang-discode-bot/about" element={<>about</>} />
          <Route path="/golang-discode-bot/contact" element={<>contact</>} />
        </Routes>
    </>
  );
}

export default App;
