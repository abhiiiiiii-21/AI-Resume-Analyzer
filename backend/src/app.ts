import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// ── Existing ATS section ──────────────────────────────────────
import { TextProcessor } from './services/TextProcessor';
import { ATSEngine } from './services/ATSEngine';
import { ParserFactory } from './parsers/ParserFactory';
import { ATSController } from './controllers/ATSController';
import { ATSRouter } from './routes/ATSRouter';
import errorHandler from './middlewares/errorHandler';

// ── Resume Enhancer section ───────────────────────────────────
import userRoutes from './routes/UserRoutes';
import resumeRoutes from './routes/ResumeRoutes';

dotenv.config();

// ── Composition Root ──────────────────────────────────────────
// ATS dependencies
const textProcessor = new TextProcessor();
const atsEngine = new ATSEngine(textProcessor);
const parserFactory = new ParserFactory();
const atsController = new ATSController(atsEngine, parserFactory);
const atsRouter = new ATSRouter(atsController);

const app = express();

// ── Global Middleware ─────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Serve generated PDFs as static files
app.use('/uploads', express.static(path.resolve('uploads')));

// ── Routes ────────────────────────────────────────────────────

app.use('/api/ats', atsRouter.router);

app.use('/api/user', userRoutes);
app.use('/api/resume', resumeRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'API is running.' });
});

// ── Global Error Handler (must be last) ───────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} (SOLID + OOP architecture)`);
});