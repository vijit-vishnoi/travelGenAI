package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
)

type TripRequest struct {
	Destination string `json:"destination" binding:"required"`
	Days        int    `json:"days" binding:"required"`
}
type ItineraryResponse struct{
	TripTitle string `json:"trip_title"`
	Destination string `json:"destination"`
	Duration int `json:"duration:"`
	BudgetTag string `json:"budget_tag"`
	Days []DayPlan `json:"days"`
}

type DayPlan struct{
	DayNumber int `json:"day_number"`
	Theme string `json:"theme"`
	Activities []Actitivty `json:"activities"`
}
type Actitivty struct{
	Time string `json:"time"`
	Title string `json:"title"`
	Description string `json:"description"`
	Location string `json:"location"`
}

func GenerateItinerary(client *genai.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req TripRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		model:=client.GenerativeModel("gemini-2.5-flash")
		model.SetTemperature(0.7)
		model.ResponseMIMEType="application/json"
		
		prompt:=fmt.Sprintf(`
		You are a travel assistant. Generate a %d-day itinerary for %s.
			
			Return the data strictly as a JSON object following this schema:
			{
			  "trip_title": "A catchy name for the trip",
			  "destination": "%s",
			  "duration": %d,
			  "budget_tag": "Moderate",
			  "days": [
				{
				  "day_number": 1,
				  "theme": "Brief theme of the day",
				  "activities": [
					{
					  "time": "Morning/Afternoon/Evening or specific time",
					  "title": "Name of activity",
					  "description": "Short description",
					  "location": "Name of place for maps"
					}
				  ]
				}
			  ]
			}
		`,req.Days,req.Destination,req.Destination,req.Days)
		resp,err:=model.GenerateContent(c,genai.Text(prompt))
		if err!=nil{
			c.JSON(http.StatusInternalServerError,gin.H{"error":"Failed to generate itinerary: "+err.Error()})
			return 
		}
		if len(resp.Candidates)>0 &&len(resp.Candidates[0].Content.Parts)>0{
			var jsonString string
			if txt,ok:=resp.Candidates[0].Content.Parts[0].(genai.Text);ok{
				jsonString=string(txt)
			} else {
				c.JSON(http.StatusInternalServerError,gin.H{"error":"Unexpected response format"})
				return 
			}
			jsonString=strings.TrimPrefix(jsonString,"```json")
			jsonString=strings.TrimPrefix(jsonString,"```")
			jsonString=strings.TrimSuffix(jsonString,"```")
			var itinerary ItineraryResponse
			if err:=json.Unmarshal([]byte(jsonString),&itinerary);err!=nil{
				c.JSON(http.StatusInternalServerError,gin.H{"error":"Failed to parse JSON","raw":jsonString})
				return
			}
			c.JSON(http.StatusOK,itinerary)
		}
	}

}