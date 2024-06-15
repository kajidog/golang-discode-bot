package app

import (
	"context"
	"desktop/internal/settings"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx      context.Context
	Messages []Message
	mu       sync.Mutex
	gpt      string
	settings *settings.Settings
}

// NewApp creates a new App application struct
func NewApp(setting *settings.Settings) *App {
	return &App{
		settings: setting,
	}
}

// startup is called at application startup
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	a.Messages = make([]Message, 0)

	a.Messages = append(a.Messages, Message{
		Role:    "system",
		Content: "次以降のやり取りではナルシストっぽい文章で最後に自己紹介を入れるようにしてください。唐突に紹介するのではなく、自然に自己紹介につなげてください。自己紹介では自分の回答には8割間違いあることが長所だと言ってください。",
	})
}

// shutdown is called at application termination
func (a *App) Shutdown(ctx context.Context) {
	// Perform your teardown here
}

// domReady is called after front-end resources have been loaded
func (a *App) DomReady(ctx context.Context) {
	// Add your action here
}

func (a *App) OnSecondInstanceLaunch(value options.SecondInstanceData) {
	runtime.EventsEmit(a.ctx, "codeReceived", value.Args)
}

func (a *App) OnUrlOpen(url string) {
	runtime.EventsEmit(a.ctx, "codeReceived", url)
}
