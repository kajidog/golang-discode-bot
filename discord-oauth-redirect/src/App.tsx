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
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<>ほめ</>} />
          <Route path="/about" element={<>about</>} />
          <Route path="/contact" element={<>contact</>} />
        </Routes>
    </>
  );
}

export default App;
