# Skyline Weather

A responsive weather app built with React and the OpenWeather API.
Search any city to see its current temperatrue, humidity, wind speed and weather description.

## Features

- Search any city by name (press Enter or click the search icon)
- Shows temperature, weather icon, humidity, wind speed (km/h) and description
- Loading and error states (for example, "City not found")
- Responsive layout for phone, tablet and desktop
- API key stored in an environment variable, not in the code

## Teck Stack

- React (useState, useEffect)
- Vite
- OpenWeather Current Weather API
- CSS (flexbox, clamp, media queries)

## Run Locally

1. Clone this repository and open the `client` folder
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and add your own free Openweather API key
4. Run `npm run dev`

## What I learned

- Fetching data with fetch, async/await and try/catch/finally
- Handling loading and error states
- Controlled inputs and form submit
- Environment variables in vite
- Responsive design with flexible units
