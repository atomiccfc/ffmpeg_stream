const express = require('express');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const app = express();
const port = 8080;

// Serve static files including 'input.mp4'
app.use(express.static(path.join(__dirname)));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Stream endpoint
app.get('/stream', (req, res) => {
    res.header('Content-Type', 'video/x-matroska');
    const videoPath = path.join(__dirname, 'input.flv');
    const ffmpegProcess = ffmpeg(videoPath)
        .outputFormat('matroska')
        .on('start', () => {
            console.log('FFmpeg process started');
        })
        .on('progress', (progress) => {
            console.log(`Streaming video... Processing: ${progress.percent}% done`);
        })
        .on('error', (err) => {
            console.error('Error processing video stream:', err.message);
            if (!res.headersSent) {
                res.sendStatus(500); // Send only if headers are not already sent
            }
        })
        .on('end', () => {
            console.log('Video stream finished');
            // No need to send anything here, the stream will close automatically
        });

    // Pipe the ffmpeg output to the response
    ffmpegProcess.pipe(res, { end: true });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});