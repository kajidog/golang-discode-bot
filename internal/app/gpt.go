package app

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
)

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

func (a *App) ChatWithGPT(prompt string) (string, error) {
	a.mu.Lock()
	defer a.mu.Unlock()

	a.Messages = append(a.Messages, Message{Role: "user", Content: prompt})

	url := "https://api.openai.com/v1/chat/completions"
	body := map[string]interface{}{
		"messages": a.Messages,
		"model":    "gpt-4o",
	}
	jsonData, err := json.Marshal(body)
	if err != nil {
		return "", err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", err
	}
	req.Header.Set("Authorization", "Bearer "+a.gpt)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	responseData, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	var response struct {
		Choices []struct {
			Message struct {
				Role    string `json:"role"`
				Content string `json:"content"`
			} `json:"message"`
		} `json:"choices"`
	}
	json.Unmarshal(responseData, &response)

	if len(response.Choices) > 0 {
		a.Messages = append(a.Messages, Message{Role: "system", Content: response.Choices[0].Message.Content})

		if len(a.Messages) > 10 {
			a.Messages = a.Messages[1:]
		}

		return response.Choices[0].Message.Content, nil
	}
	return "No response from GPT.", nil
}

func (a *App) InitializeGPT(token string) error {
	a.gpt = token
	return nil
}
