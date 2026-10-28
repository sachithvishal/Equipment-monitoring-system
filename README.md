# TelemetryMate

TelemetryMate is a full-stack MERN web application designed for monitoring power plant equipment, tracking physical conditions, and managing engineering assignments. 

## Requirements

- Node.js and npm installed on your machine
- MongoDB running locally or a MongoDB Atlas connection

## Configure the Environment

1. Navigate to the `backend` folder and create a new file named `.env`.
2. Open the `.env` file and add your MongoDB connection string :
   ```env
   MONGO_URI=your_mongodb_connection_string_here
   ```

## Run Locally

Open two separate terminals from the main project folder to run both servers concurrently.

**Terminal 1 (Backend API):**
```sh
cd backend
npm install
npm start
```
*The backend will initialize and connect to MongoDB on `http://localhost:5000`.*

**Terminal 2 (Frontend React App):**
```sh
cd frontend
npm install
npm start
```
*The React development server will start automatically.*

## Verify

- **Frontend Interface:** Open your browser and navigate to `http://localhost:3000`.
- **API Health:** The frontend automatically fetches the equipment pool from `http://localhost:5000/api/equipment`.