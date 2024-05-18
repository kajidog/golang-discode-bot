package settings

import (
	"fmt"
	"os"
	"path/filepath"

	"gopkg.in/yaml.v2"
)

func getSettingsFilePath() string {
	userHomeDir, err := os.UserHomeDir()
	if err != nil {
		panic(err)
	}
	return filepath.Join(userHomeDir, ".voice_ping", "settings.yml")
}

func defaultSettings() UserSettings {
	return UserSettings{
		Dictionary: map[string]string{
			"wails":  "うぇいるず",
			"docker": "どっかー",
		},
	}
}

func saveSettings(settings UserSettings) error {
	settingsDir := filepath.Dir(getSettingsFilePath())
	if _, err := os.Stat(settingsDir); os.IsNotExist(err) {
		os.MkdirAll(settingsDir, os.ModePerm)
	}
	data, err := yaml.Marshal(&settings)
	if err != nil {
		return err
	}
	return os.WriteFile(getSettingsFilePath(), data, 0644)
}

func loadSettings() (UserSettings, error) {
	var settings UserSettings
	data, err := os.ReadFile(getSettingsFilePath())
	if err != nil {
		if os.IsNotExist(err) {
			settings = defaultSettings()
			err = saveSettings(settings)
			if err != nil {
				return settings, fmt.Errorf("failed to save default settings: %v", err)
			}
			return settings, nil
		}
		return settings, err
	}
	err = yaml.Unmarshal(data, &settings)
	return settings, err
}
