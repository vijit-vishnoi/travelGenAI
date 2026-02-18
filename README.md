# 🌍 TravelGen AI

![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Deployment Status](https://img.shields.io/badge/Status-Deployed-success)

**TravelGen AI** is an intelligent, automated travel agent built with Go. It leverages AI to help users effortlessly plan trips, generate personalized itineraries, and discover the best recommendations for their travel destinations.

---

## ✨ Features

* **🤖 AI-Powered Itineraries:** Generates day-by-day travel plans based on user preferences, budget, and trip duration.
* **📍 Smart Recommendations:** Suggests activities, dining options, and local attractions tailored to the destination.
* **⚡ High-Performance Backend:** Built with Go for fast, concurrent processing and low latency.
* **🌐 RESTful API:** Clean and well-documented API endpoints for seamless frontend integration.
* **🚀 Fully Deployed:** Live and accessible from anywhere.

## 🛠️ Tech Stack

* **Language:** Go (Golang)
* **AI Integration:** Gemini API
* **Router/Framework:**  Gin , net/http
* **Deployment:**  Render, Vercel
<img width="1894" height="912" alt="image" src="https://github.com/user-attachments/assets/4a02a4fe-b7ac-4779-8078-8631cecc7a42" />
<img width="1278" height="819" alt="image" src="https://github.com/user-attachments/assets/afc5b983-b1ab-4bf2-a254-3b1b3cd14f0c" />
<img width="1367" height="901" alt="image" src="https://github.com/user-attachments/assets/4bf30f7d-8b62-4a14-af0e-bd69a4a3eb41" />
<img width="1293" height="902" alt="image" src="https://github.com/user-attachments/assets/a6ae1507-04cd-4332-b5ff-3d10401d100c" />



## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

* [Go](https://golang.org/doc/install) (version 1.21 or higher)
* [Git](https://git-scm.com/)
* An API key for the AI service used 

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/yourusername/travelgen-ai.git](https://github.com/yourusername/travelgen-ai.git)
    cd travelgen-ai
    ```

2.  **Install dependencies:**
    ```bash
    go mod tidy
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your configuration details:
    ```env
    PORT=4000
    DB_URI=your_database_connection_string
    AI_API_KEY=your_api_key_here
    ```

4.  **Run the application:**
    ```bash
    go run main.go
    ```
    The server should now be running on `http://localhost:4000`.

## 🌐 API Endpoints (Example)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/itinerary` | Generate a new travel itinerary based on user input. |
| `GET` | `/api/v1/health` | Check API health and uptime. |

*(Update this table based on your actual route structure)*

## 📦 Deployment

The project is currently deployed and live. You can access the production environment here:
**https://travel-gen-ai.vercel.app/**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/travelgen-ai/issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
