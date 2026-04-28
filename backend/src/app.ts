import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// ATS section
import { ATSAnalyzer } from './services/ATSAnalyzerModule';
import { ParserFactory } from './parsers/ParserFactory';
import { ATSController } from './controllers/ATSController';
import { ATSRouter } from './routes/ATSRouter';
import errorHandler from './middlewares/errorHandler';

// Resume Enhancer section
import userRoutes from './routes/UserRoutes';
import resumeRoutes from './routes/ResumeRoutes';
import dashboardRouter from './routes/DashboardRouter';
import resumeBuilderRouter from './routes/ResumeBuilderRouter';

dotenv.config();

// Composition Root
const apiKey = process.env.GROQ_API_KEY || '';
const atsAnalyzer = new ATSAnalyzer(apiKey);
const parserFactory = new ParserFactory();
const atsController = new ATSController(atsAnalyzer, parserFactory);
const atsRouter = new ATSRouter(atsController);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploads
app.use('/uploads', express.static(path.resolve('uploads')));

// Routes
app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'alive' });
});

app.use('/api/ats', atsRouter.router);
app.use('/api/user', userRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/resume-builder', resumeBuilderRouter);

app.get('/', (_req, res) => {
  res.json({ message: 'API is running.' });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});