# 使用するGoのバージョンを指定
FROM golang:1.20 as builder

# ワーキングディレクトリを設定
WORKDIR /app



RUN apt update -y
RUN apt install libgtk-3-dev libwebkit2gtk-4.0-dev xdg-utils -y
RUN go install github.com/wailsapp/wails/v2/cmd/wails@latest
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash -
