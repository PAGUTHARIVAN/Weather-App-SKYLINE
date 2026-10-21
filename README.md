# Skyline Weather

A responsive weather app built with React and the OpenWeather API.
Search any city to see its current temperatrue, humidity, wind speed and weather description.

## Features

- Search any city by name (press Enter or click the search icon)
- Shows temperature, weather icon, humidity, wind speed (km/h) and description
- Loading and error states (for example, "City not found")
- Responsive layout for phone, tablet and desktop
- The Open Weather API key is kept on the Express server, so it is never exposed to the browser.

## Teck Stack

- React (useState, useEffect)
- Vite
- OpenWeather Current Weather API
- CSS (flexbox, clamp, media queries)
- Express, Node.js

## Run Locally

You need two terminals.

**1. Start the API server**

1. Open the `server` folder and run `npm install`
2. Copy `.env.example` to `.env` and add your free OpenWeather API key
3. Run `npm run dev` (starts on http://localhost:5000)

**2. Start the React app**

1. Open the `client` folder and run `npm install`
2. Copy `.env.example` to `.env.local`
3. Run `npm run dev` (opens on http://localhost:5173)

## What I learned

- Fetching data with fetch, async/await and try/catch/finally
- Handling loading and error states
- Controlled inputs and form submit
- Environment variables in vite
- Responsive design with flexible units
