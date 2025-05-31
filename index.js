const express = require("express");
const axios = require("axios");
const app = express();

let currentLatestId = 8580000000; // Starting guess; will auto-update

async function findLatestUser(startId) {
  for (let id = startId; id < startId + 50; id++) {
    try {
      const res = await axios.get(`https://users.roblox.com/v1/users/${id}`);
      const user = res.data;
      if (user && user.name && !user.isBanned) {
        currentLatestId = id; // Save latest
        return { userId: user.id, username: user.name };
      }
    } catch {
      // Skip invalid IDs (404s)
    }
  }
  return null;
}

app.get("/latest", async (req, res) => {
  const result = await findLatestUser(currentLatestId);
  if (result) {
    return res.json(result);
  } else {
    res.status(404).json({ error: "Couldn't find a valid user." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Latest user API is running on port ${PORT}`));
