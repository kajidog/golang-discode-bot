package main

import (
	"context"
	"embed"

	"desktop/internal/app"
	"desktop/internal/bot"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/mac"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {

	app := app.NewApp()
	bot := bot.NewBot(app)
	config := NewConfig()

	err := wails.Run(&options.App{
		Title:            "VoicePing",
		Width:            1024,
		Height:           768,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup: func(ctx context.Context) {
			app.Startup(ctx)
			config.startup(ctx)
			bot.Startup(ctx)
		},
		SingleInstanceLock: &options.SingleInstanceLock{
			UniqueId:               "e3984e08-28dc-4e3d-b70a-45e961589cdc",
			OnSecondInstanceLaunch: app.OnSecondInstanceLaunch,
		},
		Mac: &mac.Options{
			OnUrlOpen: app.OnUrlOpen,
		},
		Bind: []interface{}{
			app, config, bot,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
