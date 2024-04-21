package main

import (
	"context"
	"log"

	"github.com/bwmarrin/discordgo"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Bot struct {
	session *discordgo.Session
	ctx     context.Context
}

type MessageEvent struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Content  string `json:"content"`
}

func NewBot(ctx context.Context, token string) (*Bot, error) {
	dg, err := discordgo.New("Bot " + token)
	if err != nil {
		return nil, err
	}

	bot := &Bot{
		session: dg,
		ctx:     ctx,
	}
	return bot, nil
}

func (bot *Bot) Start() {
	bot.session.AddHandler(bot.messageHandler)

	err := bot.session.Open()
	if err != nil {
		runtime.LogError(bot.ctx, "Error opening Discord session: "+err.Error())
		return
	}

	// Keep the session open
	<-bot.ctx.Done()
	bot.session.Close()
}

func (bot *Bot) messageHandler(s *discordgo.Session, m *discordgo.MessageCreate) {
	if !m.Author.Bot {
		messageEvent := MessageEvent{
			Id:       m.Author.ID,
			Username: m.Author.GlobalName, // 送信者のユーザー名
			Content:  m.Content,           // メッセージ内容
		}
		runtime.EventsEmit(bot.ctx, "messageReceived", messageEvent)
	}
}

func (b *Bot) GetGuildMembers(guildID string) ([]*discordgo.Member, error) {
	members, err := b.session.GuildMembers(guildID, "", 1000)
	if err != nil {
		log.Printf("error retrieving guild members: %v", err)
		return nil, err
	}
	return members, nil
}
func (b *Bot) GetGuilds() ([]*discordgo.UserGuild, error) {
	guilds, err := b.session.UserGuilds(100, "", "", false)
	if err != nil {
		log.Printf("Failed to retrieve guilds: %v", err)
		return nil, err
	}
	return guilds, nil
}
