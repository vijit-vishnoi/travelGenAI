package gemini

import (
	"context"
	"fmt"
	"os"
	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)
func InitializeClient()(*genai.Client,error){
	apiKey:=os.Getenv("GEMINI_API_KEY")
	if apiKey==""{
		return nil,fmt.Errorf("GEMINI_API_KEY is missing in .env")
	}
	ctx:=context.Background()
	client,err:=genai.NewClient(ctx,option.WithAPIKey(apiKey))
	if err!=nil{
		return nil,err
	}
	return client,nil
}