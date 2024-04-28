package main

import (
	"context"
	"log"
	"regexp"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Bot struct {
	session *discordgo.Session
	ctx     context.Context
	app     *App
}

type MessageEvent struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	Content  string `json:"content"`
}

func NewBot(ctx context.Context, token string, app *App) (*Bot, error) {
	dg, err := discordgo.New("Bot " + token)
	if err != nil {
		return nil, err
	}

	bot := &Bot{
		session: dg,
		ctx:     ctx,
		app:     app,
	}
	return bot, nil
}

func (bot *Bot) Start() error {
	bot.session.AddHandler(bot.messageHandler)

	err := bot.session.Open()
	if err != nil {
		runtime.LogError(bot.ctx, "Error opening Discord session: "+err.Error())
		return err
	}
	go func() {
		<-bot.ctx.Done()
		bot.session.Close()
	}()
	return nil
}

func (bot *Bot) messageHandler(s *discordgo.Session, m *discordgo.MessageCreate) {

	// メッセージの内容を取得
	messageContent := m.Content

	// メッセージにメンションが含まれているか確認し、含まれていればユーザー名に置き換える
	re := regexp.MustCompile(`<@!?(\d+)>`)
	messageContent = re.ReplaceAllStringFunc(messageContent, func(match string) string {
		id := re.FindStringSubmatch(match)[1]
		user, err := s.User(id)
		if err != nil {
			return match // エラーが発生した場合は変更なしで返す
		}
		return "@" + user.GlobalName // ユーザー名に置き換える
	})

	messageEvent := MessageEvent{
		Id:       m.Author.ID,
		Username: m.Author.GlobalName, // 送信者のユーザー名
		Content:  messageContent,      // メッセージ内容
	}
	runtime.EventsEmit(bot.ctx, "messageReceived", messageEvent)

	if strings.Contains(m.Content, "<@"+s.State.User.ID+">") {

		// メンションを取り除く
		cleanContent := strings.ReplaceAll(m.Content, "<@"+s.State.User.ID+">", "")
		cleanContent = strings.TrimSpace(cleanContent)

		// ChatGPTに送信
		response, _ := bot.app.chatWithGPT(cleanContent)

		// Discordに返信
		s.ChannelMessageSend(m.ChannelID, response)
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
