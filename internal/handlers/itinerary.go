package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/generative-ai-go/genai"
)

type TripRequest struct {
	Destination string `json:"destination" binding:"required"`
	StartDate string `json:"start_date" binding:"required"`
	EndDate string `json:"end_date" binding:"required"`
	Budget string `json:"budget"`
	Interests []string `json:"interests"`
	Travelers string `json:"travelers"`
}
type ItineraryResponse struct{
	TripTitle string `json:"trip_title"`
	Destination string `json:"destination"`
	Duration int `json:"duration"`
	BudgetTag string `json:"budget_tag"`
	TotalPrice string `json:"total_price"`
	MetaInfor MetaInfo `json:"meta_info"`
	Days []DayPlan `json:"days"`
}
type MetaInfo struct{
	WeatherSummary string `json:"weather_summary"`
	PackingList []string `json:"packing_list"`
	LocalEtiquette []string `json:"local_etiquette"`
	CurrencyRate string `json:"currency_rate"`
	MustTryFood []string `json:"must_try_food"`
	LanguageTips map[string]string `json:"language_tips"`
	SafetyInfo SafetyInfo `json:"safety_info"`
}
type SafetyInfo struct{
	IndianEmbassy string `json:"indian_embassy"`
	EmergencyNumber string `json:"emergency_numbers"`
}

type DayPlan struct{
	DayNumber int `json:"day_number"`
	Date string `json:"date"`
	Theme string `json:"theme"`
	Activities []Activity `json:"activities"`
}
type Activity struct{
	Time string `json:"time"`
	Title string `json:"title"`
	Description string `json:"description"`
	Location string `json:"location"`
	Geo GeoPoint `json:"geo"`
	Price string `json:"price"`
}
type GeoPoint struct{
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}
func calulateDuration(start,end string)(int,error){
	layout:="2006-01-02"
	t1,err:=time.Parse(layout,start)
	if err!=nil{
		return 0,err
	}
	t2,err:=time.Parse(layout,end)
	if err!=nil{
		return 0,err
	}
	days:=int(t2.Sub(t1).Hours()/24)+1
	if days<=0{
		return 0,fmt.Errorf("end date must be after start date")
	}
	return days,nil
}

func GenerateItinerary(client *genai.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req TripRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		duration,err:=calulateDuration(req.StartDate,req.EndDate)
		if err!=nil{
			c.JSON(http.StatusBadRequest,gin.H{"error":"Date Error: "+err.Error()})
			return
		}
		if req.Budget==""{req.Budget="Moderate"}
		if req.Travelers==""{req.Travelers="Traveler"}
		interestsStr := strings.Join(req.Interests, ", ")
		if interestsStr == "" { interestsStr = "General sightseeing" }
		model:=client.GenerativeModel("gemini-2.5-flash-lite")
		model.SetTemperature(0.7)
		model.ResponseMIMEType="application/json"
		
		prompt:=fmt.Sprintf(`
			Act as an expert travel consultant for an Indian client. Plan a %d-day trip to %s.

			**User Context:**
			- **Travelers:** %s
			- **Dates:** %s to %s (CRITICAL: Check day of week).
			- **Budget:** %s
			- **Interests:** %s

			**Your Responsibilities:**
			1. **Logistics:** Calculate the day of the week for each date.
			2. **Pricing:** Estimate ALL costs in **Indian Rupees (₹)**.
			3. **Coordinates:** Provide Lat/Lng for every activity.
			4. **Culture:** Specific packing list & etiquette for Indian tourists.
			
			5. **SAFETY & EMERGENCY (Logic Check):**
			- **IF Destination is INSIDE India:** - Set 'currency_rate' to "N/A (Domestic Travel)".
			  - Set 'indian_embassy' to the **State Tourism Helpline** or **Tourist Police Number**.
			- **IF Destination is OUTSIDE India:**
			  - Set 'currency_rate' to the estimated exchange rate (e.g. "1 USD ≈ ₹83").
			  - Set 'indian_embassy' to the **Indian Embassy/Consulate** details (Address, Phone).

			**JSON Schema (Strict):**
			{
			  "trip_title": "Creative Title",
			  "destination": "%s",
			  "duration": %d,
			  "budget_tag": "%s",
			  "total_price": "e.g. ₹50,000 - ₹70,000",
			  "meta_info": {
				"weather_summary": "Forecast",
				"packing_list": ["Item 1", "Item 2"],
				"local_etiquette": ["Tip 1", "Tip 2"],
				"currency_rate": "1 USD ≈ ₹83 (OR '1 INR = 1 INR' if in India)",
				"must_try_food": ["Dish 1", "Dish 2"],
				"language_tips": { "Hello": "Phrase" },
				"safety_info": {
				  "indian_embassy": "Embassy Address OR State Tourist Helpline",
				  "emergency_numbers": "Police: ..., Ambulance: ..."
				}
			  },
			  "days": [
				{
				  "day_number": 1,
				  "date": "YYYY-MM-DD (DayOfWeek)",
				  "theme": "Theme",
				  "activities": [
					{
					  "time": "Morning/Afternoon",
					  "title": "Title",
					  "description": "Desc",
					  "location": "Loc",
					  "geo": { "lat": 0.0, "lng": 0.0 },
					  "price": "₹ Cost"
					}
				  ]
				}
			  ]
			}
		`,
		duration, req.Destination,           
		req.Travelers,                      
		req.StartDate, req.EndDate,         
		req.Budget,                         
		interestsStr,                       
		req.Destination,                    
		duration,                           
		req.Budget)
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