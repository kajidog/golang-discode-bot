# golang discode bot

Discord のメッセージを読み上げるデスクトップアプリ  
voicevox を使用し、ユーザーごとに音声設定可能

## 使用言語・フレームワーク・その他

- wails cli v2.8.1
- golang v1.21.10
- node v20.12.2
- taskfile v3
- voicevox engin https://voicevox.hiroshiba.jp/

Windows

```bash
winget install Task.Task
```

macOS

```bash
brew install go-task/tap/go-task
```

## 環境構築

GoとNode.jsをインストールして以下のコマンドを実行

```bash
task init
```

## 開発

voicevox enginを`localhost:50021`で起動させた状態で以下のコマンドを実行

```bash
task dev
```
