const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public')); // Serve HTML/JS/CSS

const API_KEY = "976a55f9469d78ad881fc3daa33cf5b3"; // Replace with your real key

app.get('/lastfm', async (req, res) => {
  const { username, time_frame } = req.query;

  try {
    // Simulate time series with weekly charts (up to 5 weeks)
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        axios.get('http://ws.audioscrobbler.com/2.0/', {
          params: {
            method: 'user.gettopartists',
            user: username,
            api_key: API_KEY,
            format: 'json',
            period: time_frame, // '7day', '1month', '12month', 'overall'
            limit: 20
          }
        })
      );
    }

    // Mocking fake time slices
    const baseDate = new Date();
    const allResults = [];

    const responses = await Promise.all(promises);
    responses.forEach((response, i) => {
      const topArtists = response.data.topartists.artist;
      const date = new Date(baseDate);
      date.setDate(date.getDate() - (7 * (4 - i))); // backdate by weeks

      topArtists.forEach((artist) => {
        allResults.push({
          artist: artist.name,
          playcount: parseInt(artist.playcount),
          date: date.toISOString().split('T')[0]
        });
      });
    });

    res.json(allResults);
  } catch (error) {
    console.error('Error fetching Last.fm data:', error);
    res.status(500).json({ error: 'Failed to fetch Last.fm data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
