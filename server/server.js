require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');
const path = require('path');

const contactRoutes = require('./routes/contactRoutes');
const projectRoutes = require('./routes/projectRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const productRoutes = require('./routes/productRoutes');
const teamRoutes = require('./routes/teamRoutes');
const blogRoutes = require('./routes/blogRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const settingRoutes = require('./routes/settingRoutes');
const userRoutes = require('./routes/userRoutes');
const reorderRoutes = require('./routes/reorderRoutes');

const app = express();
app.set('trust proxy', 1);

const isProduction = process.env.NODE_ENV === 'production';

// ──────────────────────────────────────────
// Security Middleware
// ──────────────────────────────────────────

// Helmet — secure HTTP headers (CSP, HSTS, X-Frame-Options, etc.)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"]
    }
  },
  crossOriginEmbedderPolicy: false
}));

// CORS — explicit origin whitelist
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies (reduced from 50mb to 10mb to limit abuse)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Prevent NoSQL injection attacks.
// express-mongo-sanitize assigns to req.query, which is read-only in Express 5.
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Global rate limiter: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', globalLimiter);

// ──────────────────────────────────────────
// API Routes
// ──────────────────────────────────────────
app.use('/api/contacts', contactRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/reorder', reorderRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ──────────────────────────────────────────
// Production: Serve frontend static build
// ──────────────────────────────────────────
if (isProduction) {
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  app.use(express.static(clientDistPath));

  // SPA fallback — serve index.html for all non-API routes
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// ──────────────────────────────────────────
// Global Error Handler
// ──────────────────────────────────────────
app.use((err, req, res, next) => {
  // Log error details server-side only
  if (!isProduction) {
    console.error('Unhandled error:', err.stack || err.message);
  }

  // CORS error
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'CORS policy: Origin not allowed.' });
  }

  res.status(err.status || 500).json({
    message: isProduction ? 'Internal server error.' : err.message
  });
});

// ──────────────────────────────────────────
// Process-level error handlers
// ──────────────────────────────────────────
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// ──────────────────────────────────────────
// Database Connection & Server Start
// ──────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI environment variable is not set.');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('FATAL: JWT_SECRET environment variable is not set.');
  process.exit(1);
}

mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} [${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}]`);
      
      // Self-pinging keep-alive to prevent Render free tier from going to sleep
      const renderUrl = process.env.RENDER_EXTERNAL_URL;
      if (renderUrl) {
        const https = require('https');
        console.log(`Keep-alive active: Pinging ${renderUrl} every 14 minutes.`);
        setInterval(() => {
          https.get(renderUrl, (res) => {
            console.log(`Keep-alive ping sent. Status code: ${res.statusCode}`);
          }).on('error', (err) => {
            console.error('Keep-alive ping error:', err.message);
          });
        }, 14 * 60 * 1000); // 14 minutes
      }
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
