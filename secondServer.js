const express = require('express');
const app = express();

app.get('/slack/events', (req, res) => {
    res.send('Hello from Slack!');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});