import "dotenv/config";
import express from "express";
import cors from "cors";

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
    return res.status(400).json({ error: "City is required" });
  }
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${process.env.OPENWEATHER_KEY}&units=metric`;

    const apiRes = await fetch(url, { signal: AbortSignal.timeout(5000) });

    if (apiRes.status === 404) {
      return res.status(404).json({ error: "City not found" });
    }
    if (!apiRes.ok) {
      console.error("Openweather error status:", apiRes.status);
      return res.status(502).json({ error: "Weather service error" });
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
  } catch (err) {
    if (err.name === "TimeoutError") {
      return res.status(504).json({ error: "Weather service timed out" });
    }
    console.error("Weather route error:", err.message);
    res.status(500).json({ error: "Something went wrong " });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
