package app

import (
	"context"
	"sync"

	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type App struct {
	ctx      context.Context
	Messages []Message
	mu       sync.Mutex
	gpt      string
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	a.Messages = make([]Message, 0)
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
