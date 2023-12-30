// backend/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

app.get('/oauth/callback', async (req, res) => {
    const { code } = req.query;
    try {
        const response = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: "1190573505310367824",
            client_secret: "ljHnfs4SAWOR2dLNd-G-hmCirYAOJWfy",
            code,
            grant_type: 'authorization_code',
            redirect_uri: 'http://localhost:3000/callback',
            scope: 'identify guilds',
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        // Handle the response here (e.g., store access token, fetch user data)
        return res.json(response.data);
    } catch (error) {
        return res.status(500).json({ message: 'Error during Discord authentication' });
    }
});

app.get('/api/guilds', async (req, res) => {
    const accessToken = req.query.accessToken; // Get the access token from query parameters

    try {
        const guildsResponse = await axios.get('https://discord.com/api/users/@me/guilds', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log(guildsResponse.data);
        res.json(guildsResponse.data);
    } catch (error) {
        res.status(500).send('Failed to fetch guilds');
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
