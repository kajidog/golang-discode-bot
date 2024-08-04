package bot

import (
	"context"
	"desktop/internal/app"
	"fmt"
	"sync"

	"github.com/bwmarrin/discordgo"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Bot struct {
	session         *discordgo.Session
	app             *app.App
	ctx             context.Context
	mu              sync.Mutex
	conversationIds map[string]string
}

// BotInfo struct to hold bot's username and avatar URL
type BotInfo struct {
	Username  string `json:"username"`
	AvatarURL string `json:"avatarURL"`
}

func NewBot(app *app.App) *Bot {
	return &Bot{
		app:             app,
		conversationIds: make(map[string]string),
	}
}
func (b *Bot) Startup(ctx context.Context) {
	b.ctx = ctx
}

func (bot *Bot) Start(token string) error {
	var dg, err = discordgo.New("Bot " + token)
	if err != nil {
		return err
	}
	bot.session = dg
	bot.session.AddHandler(bot.messageHandler)

	err = bot.session.Open()
	if err != nil {
		runtime.LogError(bot.ctx, "Error opening Discord session: "+err.Error())
		return err
	}

	return nil
}

// GetBotInfo retrieves the bot's username and avatar URL
func (bot *Bot) GetBotInfo() (*BotInfo, error) {
	u, err := bot.session.User("@me")
	if err != nil {
		return nil, err
	}

	avatarURL := fmt.Sprintf("https://cdn.discordapp.com/avatars/%s/%s.png", u.ID, u.Avatar)
	return &BotInfo{
		Username:  u.Username,
		AvatarURL: avatarURL,
	}, nil
}

func (bot *Bot) InitializeBot(token string) (*BotInfo, error) {
	bot.mu.Lock()

	if bot != nil && bot.session != nil {
		bot.session.Close()
	}

	err := bot.Start(token)

	if err != nil {
		defer bot.mu.Unlock()
		return nil, err
	}

	botInfo, err := bot.GetBotInfo()

	if err != nil {
		defer bot.mu.Unlock()
		return nil, err
	}

	defer bot.mu.Unlock()
	return botInfo, nil
}
