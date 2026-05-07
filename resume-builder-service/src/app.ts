import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';
import { notFoundMiddleware } from './middleware/not-found.middleware';
import routes from './routes/index';

/**
 * Express Application Setup
 * 
 * This file creates and configures the Express app with:
 * 1. Security middleware (helmet, cors, rate-limit)
 * 2. Body parsing (JSON)
 * 3. Static file serving (for generated PDFs)
 * 4. API routes under /api/v1
 * 5. 404 handler for unknown routes
 * 6. Global error handler (must be last)
 * 
 * The app is exported separately from the server so it can
 * be used in tests without starting the HTTP server.
 */
const app: Application = express();

// ──────────────────────────────────────────────
// 1. Security Middleware
// ──────────────────────────────────────────────

// Helmet sets various HTTP headers to protect against common attacks
app.use(helmet());

// CORS — allow requests from configured frontend origins + all Vercel preview deployments
const allowedOrigins = env.corsOrigins;
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (curl, mobile apps, server-to-server)
            if (!origin) return callback(null, true);
            // Allow explicitly configured origins
            if (allowedOrigins.includes(origin)) return callback(null, true);
            // Allow any Vercel preview/deployment URL for this project
            if (/^https:\/\/ai-resume-analyzer[a-z0-9\-]*\.vercel\.app$/.test(origin)) return callback(null, true);
            // Block everything else
            callback(new Error(`CORS policy: origin ${origin} not allowed`));
        },
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id'],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);
// Explicitly handle OPTIONS preflight for all routes
app.options('*', cors());

// Rate limiting — prevent abuse and brute-force attacks
app.use(
    rateLimit({
        windowMs: env.rateLimitWindowMs,
        max: env.rateLimitMaxRequests,
        message: {
            success: false,
            message: 'Too many requests, please try again later.',
            errors: [],
        },
    })
);

// ──────────────────────────────────────────────
// 2. Body Parsing
// ──────────────────────────────────────────────

// Parse JSON request bodies (limit size to prevent abuse)
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded bodies (for form submissions)
app.use(express.urlencoded({ extended: true }));

// ──────────────────────────────────────────────
// 3. Static Files (generated PDFs)
// ──────────────────────────────────────────────

// Serve generated resume PDFs from the uploads directory
app.use('/uploads/resumes', express.static(path.join(__dirname, 'uploads')));

// ──────────────────────────────────────────────
// 4. API Routes
// ──────────────────────────────────────────────

// All routes are prefixed with /api/v1 for versioning
app.use('/api/v1', routes);

// ──────────────────────────────────────────────
// 4. Error Handling (must be registered last)
// ──────────────────────────────────────────────

// Handle requests to routes that don't exist
app.use(notFoundMiddleware);

// Global error handler — catches all errors from routes and middleware
app.use(errorMiddleware);

export default app;
