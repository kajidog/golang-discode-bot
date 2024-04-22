package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"

	"github.com/bwmarrin/discordgo"
)

// App struct
type App struct {
	ctx context.Context
	bot *Bot
}

type SynthesisQuery struct {
	Text    string `json:"text"`
	Speaker string `json:"speaker"`
}

type Speaker struct {
	Name      string  `json:"name"`
	SpeakerID string  `json:"speaker_uuid"`
	Styles    []Style `json:"styles"`
}

// Style はスピーカーのスタイルを表します
type Style struct {
	Name string `json:"name"`
	ID   int    `json:"id"`
	Type string `json:"type"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {

	token := "TOKEN"

	// Perform your setup here
	a.ctx = ctx
	bot, _ := NewBot(ctx, token)
	a.bot = bot
	go a.bot.Start()
}

// domReady is called after front-end resources have been loaded
func (a App) domReady(ctx context.Context) {
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	// Perform your teardown here
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}

func (a *App) SynthesizeAudio(text string, speaker string) ([]byte, error) {
	client := &http.Client{}

	// 音声クエリのURLを構築
	baseQueryURL := "http://localhost:50021/audio_query"
	queryParams := url.Values{}
	queryParams.Set("speaker", speaker)
	queryParams.Set("text", text)
	queryURL := baseQueryURL + "?" + queryParams.Encode()

	// 音声クエリのリクエストを実行
	queryResp, err := client.Post(queryURL, "application/json", nil)
	if err != nil {
		return nil, fmt.Errorf("error sending query request: %v", err)
	}
	defer queryResp.Body.Close()

	// クエリレスポンスを読み取り
	queryData, err := io.ReadAll(queryResp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading query response: %v", err)
	}

	// 音声合成のURLを構築（speakerクエリパラメータを含む）
	synthesisURL := fmt.Sprintf("http://localhost:50021/synthesis?speaker=%s", url.QueryEscape(speaker))

	// 音声合成のリクエストを送信
	synthResponse, err := client.Post(synthesisURL, "application/json", bytes.NewBuffer(queryData))
	if err != nil {
		return nil, fmt.Errorf("error sending synthesis request: %v", err)
	}
	defer synthResponse.Body.Close()

	// 合成音声データを読み取り
	synthesizedData, err := io.ReadAll(synthResponse.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading synthesized audio data: %v", err)
	}

	return synthesizedData, nil

}

func (a *App) GetGuildMembers(guildID string) ([]*discordgo.Member, error) {
	return a.bot.GetGuildMembers(guildID)
}
func (a *App) GetGuilds() ([]*discordgo.UserGuild, error) {
	return a.bot.GetGuilds()
}

func (a *App) FetchSpeakers() ([]Speaker, error) {
	url := "http://localhost:50021/speakers"
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, err
	}

	var speakers []Speaker
	if err := json.NewDecoder(resp.Body).Decode(&speakers); err != nil {
		return nil, err
	}

	return speakers, nil
}