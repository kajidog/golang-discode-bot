import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function App() {
  let [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      // ここでカスタムURLスキームを使ってアプリにコードを送る
      // 例: yourapp://auth?code=YOUR_AUTH_CODE
      window.location.href = `voiceping://auth?code=${code}`;
    }
  }, [searchParams]);

  return (
    <div className="App">
      <header className="App-header">
        {searchParams.has("code") ? (
          <p>認証コードをアプリに送信中...</p>
        ) : (
          <p>認証コードが見つかりません。</p>
        )}
      </header>
    </div>
  );
}

export default App;
