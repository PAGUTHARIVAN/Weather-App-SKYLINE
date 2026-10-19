import express from "express";

const app = express();
const PORT = 5000;

app.get("/", (req, res) => {
  res.send("Server is running...");
});
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
