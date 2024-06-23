package bot

import (
	"github.com/bwmarrin/discordgo"
)

func (b *Bot) GetChannels(guildId string) ([]*discordgo.Channel, error) {
	channels, err := b.session.GuildChannels(guildId)
	if err != nil {
		return nil, err
	}

	return channels, nil
}
