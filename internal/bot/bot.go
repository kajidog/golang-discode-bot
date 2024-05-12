package bot

import (
	"context"
	"desktop/internal/app"
	"sync"

	"github.com/bwmarrin/discordgo"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Bot struct {
	session *discordgo.Session
	app     *app.App
	ctx     context.Context
	mu      sync.Mutex
}

func NewBot() *Bot {
	return &Bot{}
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

func (bot *Bot) InitializeBot(token string) error {
	bot.mu.Lock()

	if bot != nil && bot.session != nil {
		bot.session.Close()
	}

	err := bot.Start(token)

	if err != nil {
		defer bot.mu.Unlock()
		return err
	}

	defer bot.mu.Unlock()

	return nil
}
