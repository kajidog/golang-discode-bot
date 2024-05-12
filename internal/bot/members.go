package bot

import (
	"log"

	"github.com/bwmarrin/discordgo"
)

func (b *Bot) GetGuildMembers(guildID string) ([]*discordgo.Member, error) {
	members, err := b.session.GuildMembers(guildID, "", 1000)
	if err != nil {
		log.Printf("error retrieving guild members: %v", err)
		return nil, err
	}
	return members, nil
}
