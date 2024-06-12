package bot

import (
	"desktop/internal/app"
	"log"

	"github.com/bwmarrin/discordgo"
)

func (b *Bot) GetGuilds() ([]app.UserGuildWithIcon, error) {
	guilds, err := b.session.UserGuilds(100, "", "", false)
	if err != nil {
		log.Printf("Failed to retrieve guilds: %v", err)
		return nil, err
	}

	var guildInfos []app.UserGuildWithIcon
	for _, guild := range guilds {
		iconURL := discordgo.EndpointGuildIcon(guild.ID, guild.Icon)
		guildInfos = append(guildInfos, app.UserGuildWithIcon{
			UserGuild: *guild,
			IconURL:   iconURL,
		})
	}

	return guildInfos, nil
}
