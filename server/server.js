import "dotenv/config";
import express from "express";
import cors from "cors";
import { AppError } from "./errors.js";

const app = express();
app.disable("x-powered-by");
const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173,http://127.0.0.1:5173"
)
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

const PORT = process.env.PORT || 5000;

if (!process.env.OPENWEATHER_KEY) {
  console.error("Missing OPENWEATHER_KEY in server/.env");
  process.exit(1);
}

app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

app.get("/api/weather", async (req, res) => {
  const city = typeof req.query.city === "string" ? req.query.city.trim() : "";
  if (!city) {
    throw new AppError(400, "City is required");
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_KEY}&units=metric`;
  let apiRes;
  try {
    apiRes = await fetch(url, { signal: AbortSignal.timeout(5000) });
  } catch (err) {
    if (err.name === "TimeoutError") {
      throw new AppError(504, "Weather service timed out");
    }
    throw new AppError(502, "Weather service unreachable");
  }
  if (apiRes.status === 404) {
    throw new AppError(404, "City not found");
  }
  if (!apiRes.ok) {
    console.error("OpenWeather error status:", apiRes.status);
    throw new AppError(502, "Weather service error");
  }
  const data = await apiRes.json();
  res.json({
    city: data.name,
    country: data.sys?.country,
    temp: data.main.temp,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    description: data.weather?.[0]?.description,
    icon: data.weather?.[0]?.icon,
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(err);
  }
  if (res.headersSent) {
    return next(err);
  }
  const message =
    err instanceof AppError || status < 500
      ? err.message
      : "Internal server error";

  res.status(status).json({ error: message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
