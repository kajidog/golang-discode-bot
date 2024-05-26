// openfile.go

package settings

import (
	"fmt"
	"os/exec"
	"runtime"
)

// OpenSettingsFile opens the settings file in the default file explorer
func OpenSettingsFile() error {
	settingsFilePath := getSettingsFilePath()
	var cmd *exec.Cmd

	switch runtime.GOOS {
	case "windows":
		cmd = exec.Command("explorer", "/select,", settingsFilePath)
	case "darwin":
		cmd = exec.Command("open", "-R", settingsFilePath)
	case "linux":
		cmd = exec.Command("xdg-open", settingsFilePath)
	default:
		return fmt.Errorf("unsupported platform")
	}

	err := cmd.Start()
	if err != nil {
		return fmt.Errorf("failed to open settings file: %w", err)
	}
	return nil
}
