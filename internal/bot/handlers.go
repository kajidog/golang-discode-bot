package bot

import (
	"regexp"
	"strings"

	"github.com/bwmarrin/discordgo"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type MessageEvent struct {
	Id       string `json:"id"`
	Username string `json:"username"`
	UserId   string `json:"user_id"`
	Content  string `json:"content"`
	GuildId  string `json:"guild_id"`
}

func (bot *Bot) messageHandler(s *discordgo.Session, m *discordgo.MessageCreate) {

	messageContent := m.Content // 新規メッセージの内容

	// メンションが含まれているか確認し、ユーザー名に置き換える
	re := regexp.MustCompile(`<@!?(\d+)>`)
	messageContent = re.ReplaceAllStringFunc(messageContent, func(match string) string {
		id := re.FindStringSubmatch(match)[1]
		user, err := s.User(id)
		if err != nil {
			return match
		}
		return "@" + user.GlobalName
	})

	// フロントにメッセージを送信
	messageEvent := MessageEvent{
		Id:       m.Author.ID,
		Username: m.Author.GlobalName,
		UserId:   m.Author.ID,
		Content:  messageContent,
		GuildId:  m.GuildID,
	}
	runtime.EventsEmit(bot.ctx, "messageReceived", messageEvent)

	// Botにメンションされていた場合
	if strings.Contains(m.Content, "<@"+s.State.User.ID+">") {
		// メンションを取り除く
		cleanContent := strings.ReplaceAll(m.Content, "<@"+s.State.User.ID+">", "")
		cleanContent = strings.TrimSpace(cleanContent)

		// 入力中を設定
		s.ChannelTyping(m.ChannelID)

		// ChatGPTに送信
		response, _ := bot.app.ChatWithGPT(cleanContent)

		// Discordに返信
		s.ChannelMessageSend(m.ChannelID, response)
	}
}
