package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
)

type GeoResponse struct {
	Results []struct {
		Latitude  float64 `json:"latitude"`
		Longitude float64 `json:"longitude"`
	} `json:"results"`
}

func GetCoordinates(city string) (float64, float64, error) {
	endpoint := fmt.Sprintf("https://geocoding-api.open-meteo.com/v1/search?name=%s&count=1&language=en&format=json",url.QueryEscape(city))
	resp,err:=http.Get(endpoint)
	if err!=nil{
		return 0,0,err
	}
	defer resp.Body.Close()
	var geo GeoResponse
	if err:=json.NewDecoder(resp.Body).Decode(&geo);err!=nil{
		return 0,0,err
	}
	if len(geo.Results)==0{
		return 0,0,fmt.Errorf("location not found")
	}
	return geo.Results[0].Latitude,geo.Results[0].Longitude,nil
};