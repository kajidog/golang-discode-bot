package app

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"

	"github.com/bwmarrin/discordgo"
)

type UserInfo struct {
	AvatarURL string          `json:"avatarURL"`
	Other     *discordgo.User `json:"other"`
}

type UserGuildWithIcon struct {
	discordgo.UserGuild
	IconURL string `json:"iconURL"`
}

type TokenResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
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
	return UserInfo{
		AvatarURL: avatarURL,
		Other:     user,
	}, nil
}

func (a *App) RefreshDiscordToken(clientID, clientSecret, refreshToken string) (TokenResponse, error) {
	// Discordのトークンエンドポイント
	url := "https://discord.com/api/oauth2/token"

	// データをURLエンコードする
	data := fmt.Sprintf("client_id=%s&client_secret=%s&grant_type=refresh_token&refresh_token=%s",
		clientID, clientSecret, refreshToken)
	payload := strings.NewReader(data)

	req, err := http.NewRequest("POST", url, payload)
	if err != nil {
		return TokenResponse{}, err
	}
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	res, err := client.Do(req)
	if err != nil {
		return TokenResponse{}, err
	}
	defer res.Body.Close()

	var tokenResponse TokenResponse
	if err := json.NewDecoder(res.Body).Decode(&tokenResponse); err != nil {
		return TokenResponse{}, err
	}

	return tokenResponse, nil
}
