package bot

import (
	"fmt"
	"os"
)

func (b *Bot) SendFileToDiscord(channelID string, file *os.File) error {
	file.Seek(0, 0)

	_, err := b.session.ChannelFileSend(channelID, file.Name(), file)
	if err != nil {
		return fmt.Errorf("failed to send file to Discord: %w", err)
	}

	return nil
}
