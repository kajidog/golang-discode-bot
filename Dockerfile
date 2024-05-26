# 使用するGoのバージョンを指定
FROM golang:1.21.10 as builder

WORKDIR /app
ENV NODE_VERSION 20.12.2
ENV NVM_DIR /root/.nvm

# wails 設定
RUN apt update -y
RUN apt install -y libgtk-3-dev libwebkit2gtk-4.0-dev xdg-utils \
    libx11-dev libxcomposite-dev libxrandr-dev libxi-dev \
    libxcursor-dev libxdamage-dev libxext-dev libxfixes-dev \
    xvfb
RUN go install github.com/wailsapp/wails/v2/cmd/wails@latest

# node 設定
COPY package.json package-lock.json ./
COPY ./frontend/package.json ./frontend/package-lock.json ./frontend/
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash \
    && . $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default \
    && npm install

CMD ["/bin/bash", "-c", ". $NVM_DIR/nvm.sh && wails dev"]