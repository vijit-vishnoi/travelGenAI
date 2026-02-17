package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
)

type TripRequest struct {
	Destination string `json:"destination" binding:"required"`
	Days        int    `json:"days" binding:"required"`
}

func GenerateItinerary(client *genai.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req TripRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		prompt:=fmt.Sprintf("Create a %d-day travel itinerary for %s. Give me a say-by-day breakdown.",req.Days,req.Destination)
		model:=client.GenerativeModel("gemini-2.5-flash")
		resp,err:=model.GenerateContent(c,genai.Text(prompt))
		if err!=nil{
			c.JSON(http.StatusInternalServerError,gin.H{"error":"Failed to generate itinerary: "+err.Error()})
			return 
		}
		if len(resp.Candidates)>0 &&len(resp.Candidates[0].Content.Parts)>0{
			part:=resp.Candidates[0].Content.Parts[0]
			c.JSON(http.StatusOK,gin.H{"itinerary":part})
		} else{
			c.JSON(http.StatusInternalServerError,gin.H{"error":"Empty response from AI"})
		}
	}

}