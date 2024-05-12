package bot

import (
	"log"

	"github.com/bwmarrin/discordgo"
)

func (b *Bot) GetGuilds() ([]*discordgo.UserGuild, error) {
	guilds, err := b.session.UserGuilds(100, "", "", false)
	if err != nil {
		log.Printf("Failed to retrieve guilds: %v", err)
		return nil, err
	}
	return guilds, nil
}
