const express = require('express');
const http = require('http');
const socket = require('./socket');
const indexRouter = require('./routes/index');
const wakeWordController = require('./controllers/wakeWordController');
const { scheduleHourlyAnnouncement } = require('./controllers/timeAnnouncerController');
const { logWithTimestamp } = require('./utils/logger');
const path = require('path');

logWithTimestamp('Initializing application...');

const app = express();
const server = http.createServer(app);
const io = socket.init(server);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/', indexRouter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set correct MIME types
app.use((req, res, next) => {
  if (req.url.endsWith('.js')) {
    res.type('application/javascript');
  } else if (req.url.endsWith('.css')) {
    res.type('text/css');
  }
  next();
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  logWithTimestamp(`Server is running on port ${PORT}`);
});

// Initialize wake word detection
wakeWordController.initializeWakeWordDetection()
  .then(() => {
    logWithTimestamp('Wake word detection initialized successfully');
  })
  .catch((error) => {
    logWithTimestamp(`Error initializing wake word detection: ${error.message}`);
  });

// Schedule hourly time announcements
scheduleHourlyAnnouncement();
logWithTimestamp('Hourly announcements scheduled');