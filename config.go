package main

import (
	"context"
)

type DiscordConfig struct {
	ClientSecret string `json:"client_secret"`
	ClientID     string `json:"client_id"`
	BotToken     string `json:"bot_token"`
	RedirectURI  string `json:"redirect_uri"`
}

// ここのコメント解除したら、ユーザーがこのアプリで使用するDiscordアプリの設定画面が消えます。
// Discordのアプリの設定ページ　https://discord.com/developers/applications
var useDiscordConfig = DiscordConfig{
	// ClientSecret: "your-client-secret",
	// ClientID:     "your-client-id",
	// BotToken:     "your-bot-token",
	// RedirectURI:  "https://your-redirect-uri",
}

type Config struct {
	ctx     context.Context
	discord DiscordConfig
}

func NewConfig() *Config {
	return &Config{}
}

func (c *Config) startup(ctx context.Context) {
	c.ctx = ctx
	c.discord = useDiscordConfig
}

func (c *Config) GetBotConfig() DiscordConfig {
	return c.discord
}
