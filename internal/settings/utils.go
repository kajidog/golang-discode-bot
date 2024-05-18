// utils.go

package settings

import (
	"strings"
)

// ReplaceWords takes a string and replaces words based on the dictionary settings
func replaceWords(input string, dictionary map[string]string) string {
	output := input
	for before, after := range dictionary {
		output = strings.ReplaceAll(output, before, after)
	}
	return output
}
