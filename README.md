# URL Shortener

A full-stack URL Shortener application that allows users to generate short links for long URLs and redirect using the short links. Built with React (frontend) and Spring Boot (backend).

---

## Features
- Shorten long URLs to compact, shareable links
- Redirect to original URLs using short links
- Simple and clean web interface
- Persistent storage using a database (via Spring Data JPA)

---

## Tech Stack
- **Frontend:** React (JavaScript)
- **Backend:** Spring Boot (Java)
- **Database:** H2 (default, can be changed)

---

## Project Structure
```
URL-Shortener/
  client/short-url/      # React frontend
  server/short-url/      # Spring Boot backend
```

---

## Setup Instructions

### 1. Backend (Spring Boot)
1. Navigate to the backend directory:
   ```sh
   cd server/short-url
   ```
2. Build and run the application:
   - Using Maven Wrapper:
     ```sh
     ./mvnw spring-boot:run
     ```
   - Or with Maven:
     ```sh
     mvn spring-boot:run
     ```
3. The backend will start on [http://localhost:9999](http://localhost:9999)

### 2. Frontend (React)
1. Open a new terminal and navigate to the frontend directory:
   ```sh
   cd client/short-url
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```
4. The frontend will run on [http://localhost:3000](http://localhost:3000)

---

## Usage
- Open the frontend in your browser.
- Enter a long URL and click "Shorten".
- Copy the generated short URL and use it to redirect to the original URL.

---

## API Endpoints (Backend)

- `POST /api/shorten`
  - Request: `{ "originalUrl": "https://example.com" }`
  - Response: `{ "id": 1, "originalUrl": "https://example.com", "shortCode": "eEoE39" }`

- `GET /{shortCode}`
  - Redirects to the original URL associated with `shortCode`.
