package bot

import (
	"fmt"
	"strings"

	"github.com/bwmarrin/discordgo"
)

const maxMessageLength = 1000

// Function to split a message into chunks
func SplitMessage(message string) []string {
	if len(message) <= maxMessageLength {
		return []string{message}
	}

	var chunks []string
	var buffer strings.Builder
	words := strings.Fields(message)

	for _, word := range words {
		if buffer.Len()+len(word)+1 > maxMessageLength {
			chunks = append(chunks, buffer.String())
			buffer.Reset()
		}
		if buffer.Len() > 0 {
			buffer.WriteString(" ")
		}
		buffer.WriteString(word)
	}

	if buffer.Len() > 0 {
		chunks = append(chunks, buffer.String())
	}

	return chunks
}

// Function to send a message and split it if necessary
func SendMessage(session *discordgo.Session, channelID, message string) {
	chunks := SplitMessage(message)
	for _, chunk := range chunks {
		_, err := session.ChannelMessageSend(channelID, chunk)
		if err != nil {
			fmt.Println("Error sending message:", err)
		}
	}
}
