package main

import (
	"log"
	"os"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"github.com/vijit-vishnoi/travelgen-ai/internal/gemini"
	"github.com/vijit-vishnoi/travelgen-ai/internal/handlers"
)

func main() {
	if err:=godotenv.Load();err!=nil{
		log.Println("No .env file found ,relying on system env")
	}
	client,err:=gemini.InitializeClient()
	if err!=nil{
		log.Fatal("Failed to connect to Gemini: ",err)
	}
	defer client.Close()
	r:=gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:[]string{"http://localhost:5173"},
		AllowMethods:[]string{"POST","OPTIONS"},
		AllowHeaders:[]string{"Origin","Content-Type","Accept"},
		ExposeHeaders:[]string{"Content-Length"},
		AllowCredentials:true,
	}))
	r.POST("/api/generate",handlers.GenerateItinerary(client))
	port:=os.Getenv("PORT")
	if port==""{
		port="4000"
	}
	log.Printf("Server starting on port %s...",port)
	r.Run(":"+port)
}