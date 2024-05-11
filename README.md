# golang discode bot

Discord のメッセージを読み上げるデスクトップアプリ  
voicevox を使用し、ユーザーごとに音声設定可能

## 使用言語・フレームワーク・その他

- wails cli v2.8.1
- golang v1.20
- node v20.12.2
- docker-compose
- taskfile v3

```bash
winget install Task.Task
```

## 環境構築

### docker

```bash
docker compose up
```

### node

```bash
npm i
```

## 開発

```
wails dev
```
