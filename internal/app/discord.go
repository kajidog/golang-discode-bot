package app

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/bwmarrin/discordgo"
)

type UserInfo struct {
	AvatarURL string `json:"avatarURL"`
}

type UserGuildWithIcon struct {
	discordgo.UserGuild
	IconURL string `json:"iconURL"`
}

func (a *App) GetUserGuilds(token string) ([]UserGuildWithIcon, error) {
	dg, err := discordgo.New("Bearer " + token)
	if err != nil {
		return nil, err
	}

	guilds, err := dg.UserGuilds(100, "", "", false)
	if err != nil {
		return nil, fmt.Errorf("failed to get guilds: %w", err)
	}

	var guildInfos []UserGuildWithIcon
	for _, guild := range guilds {
		iconURL := discordgo.EndpointGuildIcon(guild.ID, guild.Icon)
		guildInfos = append(guildInfos, UserGuildWithIcon{
			UserGuild: *guild,
			IconURL:   iconURL,
		})
	}

	return guildInfos, nil
}

func (a *App) FetchDiscordToken(clientID, clientSecret, code, redirectURI string) (string, error) {
	data := url.Values{}
	data.Set("client_id", clientID)
	data.Set("client_secret", clientSecret)
	data.Set("grant_type", "authorization_code")
	data.Set("code", code)
	data.Set("redirect_uri", redirectURI)

	req, err := http.NewRequest("POST", "https://discordapp.com/api/oauth2/token", strings.NewReader(data.Encode()))
	if err != nil {
		return "", err
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

func (a *App) GetDiscordAvatar(token string) (UserInfo, error) {
	dg, err := discordgo.New("Bearer " + token)
	if err != nil {
		return UserInfo{}, err
	}

	user, err := dg.User("@me")
	if err != nil {
		return UserInfo{}, err
	}

	avatarURL := user.AvatarURL("1024")
	return UserInfo{avatarURL}, nil
}
