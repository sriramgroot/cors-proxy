const express = require("express");
const cors = require("cors");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
const PORT = 443;

app.use(cors()); // Enable CORS
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded body
app.use(bodyParser.json()); // Parse JSON body

app.all("/proxy", async (req, res) => {
    try {
        const { url, method = "POST", headers = {}, body = {} } = req.body;

        if (!url) {
            return res.status(400).json({ error: "Missing URL in request body" });
        }

        // Prepare request payload
        const requestData = {
            method,
            url,
            headers,
            data: method === "POST" ? new URLSearchParams(body).toString() : undefined,
        };

        // Forward request
        const response = await axios(requestData);

        res.status(response.status).send(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 CORS Proxy running on http://localhost:${PORT}`);
});
