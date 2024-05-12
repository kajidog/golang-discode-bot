package app

import (
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/bwmarrin/discordgo"
)

func (a *App) GetUserGuilds(token string) ([]*discordgo.UserGuild, error) {
	dg, err := discordgo.New("Bearer " + token)
	if err != nil {
		return nil, err
	}

	guilds, err := dg.UserGuilds(100, "", "", false)
	if err != nil {
		return nil, fmt.Errorf("failed to get guilds: %w", err)
	}

	return guilds, nil
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
