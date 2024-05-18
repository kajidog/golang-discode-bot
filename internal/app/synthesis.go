package app

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

type SynthesisQuery struct {
	Text    string `json:"text"`
	Speaker string `json:"speaker"`
}

type Speaker struct {
	Name      string  `json:"name"`
	SpeakerID string  `json:"speaker_uuid"`
	Styles    []Style `json:"styles"`
}

type Style struct {
	Name string `json:"name"`
	ID   int    `json:"id"`
	Type string `json:"type"`
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

func (a *App) SynthesizeAudio(text string, speaker string) ([]byte, error) {
	client := &http.Client{}
	replaceText, _ := a.settings.ReplaceWords(text)
	baseQueryURL := "http://localhost:50021/audio_query"
	queryParams := url.Values{}
	queryParams.Set("speaker", speaker)
	queryParams.Set("text", replaceText)
	queryURL := baseQueryURL + "?" + queryParams.Encode()

	queryResp, err := client.Post(queryURL, "application/json", nil)
	if err != nil {
		return nil, fmt.Errorf("error sending query request: %v", err)
	}
	defer queryResp.Body.Close()

	queryData, err := io.ReadAll(queryResp.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading query response: %v", err)
	}

	synthesisURL := fmt.Sprintf("http://localhost:50021/synthesis?speaker=%s", url.QueryEscape(speaker))

	synthResponse, err := client.Post(synthesisURL, "application/json", bytes.NewBuffer(queryData))
	if err != nil {
		return nil, fmt.Errorf("error sending synthesis request: %v", err)
	}
	defer synthResponse.Body.Close()

	synthesizedData, err := io.ReadAll(synthResponse.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading synthesized audio data: %v", err)
	}

	return synthesizedData, nil
}
