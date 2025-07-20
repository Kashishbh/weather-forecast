import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 5000;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || 'YOUR_OPENWEATHERMAP_API_KEY';

app.use(cors());

// Proxy endpoint for weather data
app.get('/weather', async (req, res) => {
  const { lat, lon, city } = req.query;
  let url = '';
  if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${WEATHER_API_KEY}`;
  } else if (city) {
    url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${WEATHER_API_KEY}`;
  } else {
    return res.status(400).json({ error: 'Missing lat/lon or city parameter' });
  }
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/', (req, res) => {
  res.send('Weather backend is running!');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
}); 