# AI WeatherWise API

**AI WeatherWise API** is a RESTful backend application built using **Node.js, Express.js, MongoDB, and Mongoose**. The application provides secure user authentication, favorite location management, real-time weather information, and AI-powered weather insights.

The project also includes an **AI Weather Assistant** that can provide weather-related summaries, recommendations, and conversational responses based on weather information.

---

## Features

### User Authentication

* User registration and login
* Password hashing using **bcrypt**
* JWT-based authentication
* Protected API routes
* Logged-in user profile lookup

### Favorite Locations

Authenticated users can:

* Add favorite locations
* View saved locations
* Update locations
* Delete locations

### Current Weather

* Retrieves current weather information using **OpenWeatherMap**
* Provides:

  * Temperature
  * Humidity
  * Wind speed
  * Weather condition

### AI Weather Insights

* Uses **Google Gemini API** for AI-powered weather information
* Generates:

  * Weather summaries
  * Personalized recommendations
  * Clothing suggestions
  * Activity suggestions
  * Hydration-related suggestions

### AI Weather Assistant

The project includes an AI-powered assistant that allows users to interact with the weather system using natural-language questions.

For example:

* "What should I wear today?"
* "Is it a good day to go outside?"
* "How should I prepare for this weather?"
* "Will I need to stay hydrated?"

### Fallback Mode

If the external weather or AI API is unavailable, the application can use local fallback responses so that the API can still be tested without completely depending on external services.

---

## Technology Stack

| Technology             | Purpose                |
| ---------------------- | ---------------------- |
| **Node.js**            | Backend runtime        |
| **Express.js**         | REST API framework     |
| **MongoDB**            | Database               |
| **Mongoose**           | MongoDB ODM            |
| **JWT**                | Authentication         |
| **bcryptjs**           | Password hashing       |
| **OpenWeatherMap API** | Weather data           |
| **Google Gemini API**  | AI-generated responses |
| **Thunder Client**     | API testing            |

---

## Project Structure

```text
src/
├── config/
│   └── db.js                  # MongoDB connection

├── models/
│   ├── User.js                # User schema
│   └── Location.js            # Favorite location schema

├── middleware/
│   └── authMiddleware.js      # JWT authentication middleware

├── controllers/
│   ├── authController.js      # Authentication handlers
│   ├── locationController.js  # Favorite location handlers
│   ├── weatherController.js   # Weather handlers
│   └── aiController.js        # AI request handlers

├── routes/
│   ├── authRoutes.js
│   ├── locationRoutes.js
│   ├── weatherRoutes.js
│   └── aiRoutes.js

├── services/
│   ├── weatherService.js      # Weather API and fallback logic
│   └── aiService.js           # Gemini AI and fallback logic

├── app.js                     # Express application setup
└── server.js                  # Application entry point
```

---

## Getting Started

### 1. Prerequisites

Make sure the following are installed:

* **Node.js v18+**
* **npm**
* **MongoDB** (local MongoDB or MongoDB Atlas)

### 2. Install Dependencies

Run the following command in the project root:

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the project root:

```env
PORT=5001

MONGO_URI=mongodb://127.0.0.1:27017/weatherwise

JWT_SECRET=your_super_secret_jwt_key

OPENWEATHER_API_KEY=your_openweathermap_api_key

GEMINI_API_KEY=your_gemini_api_key
```

> **Important:** Never upload your `.env` file or expose your API keys publicly.

### 4. Start MongoDB

Make sure your local MongoDB server is running before starting the application.

### 5. Start the Server

Development mode:

```bash
npm run dev
```

Or:

```bash
node src/server.js
```

The API will run on:

```text
http://localhost:5001
```

---

## API Endpoints

### Authentication

| Endpoint             | Method | Access  | Description                |
| -------------------- | ------ | ------- | -------------------------- |
| `/api/auth/register` | POST   | Public  | Register a new user        |
| `/api/auth/login`    | POST   | Public  | Login and receive JWT      |
| `/api/auth/profile`  | GET    | Private | Get logged-in user profile |

### Register

```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
```

---

### Favorite Locations

All location endpoints require a valid JWT token.

| Endpoint             | Method | Description             |
| -------------------- | ------ | ----------------------- |
| `/api/locations`     | POST   | Add a favorite location |
| `/api/locations`     | GET    | Get favorite locations  |
| `/api/locations/:id` | PUT    | Update a location       |
| `/api/locations/:id` | DELETE | Delete a location       |

Example:

```json
{
  "city": "Chennai",
  "country": "India"
}
```

---

### Weather

| Endpoint             | Method | Access | Description                     |
| -------------------- | ------ | ------ | ------------------------------- |
| `/api/weather/:city` | GET    | Public | Get current weather information |

Example:

```text
GET /api/weather/Chennai
```

The response can include:

```text
Temperature
Humidity
Wind Speed
Weather Condition
```

---

## AI Weather Features

### Weather Summary

```text
POST /api/ai/weather-summary
```

Requires JWT authentication.

Example request:

```json
{
  "city": "Chennai",
  "temperature": 32,
  "humidity": 70,
  "condition": "Partly cloudy"
}
```

The AI generates a natural-language summary based on the supplied weather information.

### Weather Recommendation

```text
POST /api/ai/weather-recommendation
```

Example:

```json
{
  "temperature": 32,
  "condition": "Sunny"
}
```

The AI can provide suggestions related to clothing, outdoor activities, and hydration.

---

## AI Weather Assistant

The AI assistant provides a conversational interface for weather-related questions.

Users can ask questions such as:

```text
"What should I wear in this weather?"

"Is it suitable for outdoor activities?"

"How can I stay comfortable in hot weather?"
```

The assistant processes the request through the backend AI service and returns an appropriate response.

---

## API Testing with Thunder Client

The APIs can be tested using **Thunder Client** inside Visual Studio Code.

Recommended testing order:

```text
1. Register
      ↓
2. Login
      ↓
3. Copy JWT token
      ↓
4. Test Profile
      ↓
5. Add Favorite Location
      ↓
6. Get Favorite Locations
      ↓
7. Test Weather API
      ↓
8. Test AI Weather Summary
      ↓
9. Test AI Recommendation
      ↓
10. Test AI Weather Assistant
```

For protected endpoints, include the JWT token in the request authorization header:

```text
Authorization: Bearer <your_token>
```

---

## Application Flow

```text
User
  │
  ▼
Express.js API
  │
  ├── Authentication ──► MongoDB
  │
  ├── Locations ───────► MongoDB
  │
  ├── Weather ─────────► OpenWeatherMap
  │
  └── AI Features ─────► Google Gemini
                              │
                              ▼
                         AI Response
```

---

## Security

The application uses:

* **bcryptjs** for password hashing
* **JWT** for authentication
* Protected routes using authentication middleware
* Environment variables for API keys and secrets

API keys and sensitive credentials should **not** be committed to GitHub.

---

## Project Objective

The main objective of **AI WeatherWise API** is to demonstrate how a modern backend application can combine:

* REST APIs
* Database management
* Authentication
* External API integration
* Generative AI
* Fallback mechanisms

into a single practical application.

---

## Project

**AI WeatherWise API**

**Backend Technologies:** Node.js, Express.js, MongoDB, Mongoose, JWT, Google Gemini, OpenWeatherMap

**API Testing:** Thunder Client
