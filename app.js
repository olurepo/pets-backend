const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');

const { addExpressLogger } = require('./expressLogger');
const { getRateLimiter } = require('./rate-limiter');
const { 
  PetController,
} = require('./src');



mongoose.connect('mongodb+srv://root:root@cluster0.5letpqk.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const securityHeaders = (
  _req,
  res,
  next
) => {
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  res.setHeader('X-Content-Type-Options', 'nosniff');
  let extraSources = '';
  res.setHeader(
      'Content-Security-Policy',
      `default-src 'self' ${extraSources}`.trim()
      );
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};
    
    
(function () {
    const app = express();
    
    app.use(cookieParser());
    app.use(securityHeaders);
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json({ limit: '10mb' }));
    const corsOptions = {
        origin: [
          'http://localhost:3000'
        ],
        credentials: true,
        methods: 'GET, POST, OPTIONS, DELETE',
        allowedHeaders: [
          'Origin',
          'X-Requested-With',
          'Content-Type',
          'Accept',
          'Authorization',
        ],
        optionsSuccessStatus: 200,
        exposedHeaders: ['Content-Disposition'],
      };
    app.use(cors(corsOptions));


    addExpressLogger(app);
    // app.use(getRateLimiter());
    app.use(express.static('public'));

    app.get('/api/pets', (req, res) => {
      const petController = new PetController();
      petController.searchPets(req,res);
    });
    
    app.get('/api/pets/:id', (req, res) => {
      const petController = new PetController();
      petController.getPet(req,res);
    });

    // Listen to the App Engine-specified port, or 8080 otherwise
    const PORT = 8080;
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}...`);
    });
})()

