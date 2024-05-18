// settings.go

package settings

import (
	"context"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Settings struct {
	ctx      context.Context
	settings UserSettings
}

func NewApp() *Settings {
	return &Settings{}
}

// Startup is called at application startup
func (s *Settings) Startup(ctx context.Context) {
	settings, _ := loadSettings()
	s.settings = settings
	s.ctx = ctx
}

func (s *Settings) SaveSettings(settings UserSettings) string {
	err := saveSettings(settings)
	if err != nil {
		return err.Error()
	}
	return "Settings saved successfully"
}

func (s *Settings) LoadSettings() (UserSettings, string) {
	settings, err := loadSettings()
	if err != nil {
		return settings, err.Error()
	}
	s.settings = settings
	runtime.EventsEmit(s.ctx, "settingLoaded", settings)
	return settings, "Settings loaded successfully"
}

func (s *Settings) ReplaceWords(input string) (string, string) {
	output := replaceWords(input, s.settings.Dictionary)
	return output, "Words replaced successfully"
}

func (s *Settings) OpenSettingsFile() string {
	err := OpenSettingsFile()
	if err != nil {
		return err.Error()
	}
	return "Settings file opened successfully"
}
