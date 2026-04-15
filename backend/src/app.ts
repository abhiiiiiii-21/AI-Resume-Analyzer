import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Services
import { TextProcessor } from './services/TextProcessor';
import { ATSEngine } from './services/ATSEngine';

// Parsers
import { ParserFactory } from './parsers/ParserFactory';

// Controller & Router
import { ATSController } from './controllers/ATSController';
import { ATSRouter } from './routes/ATSRouter';

dotenv.config();

// Composition Root — all dependencies wired here (DIP)
const textProcessor = new TextProcessor();
const atsEngine = new ATSEngine(textProcessor);
const parserFactory = new ParserFactory();
const atsController = new ATSController(atsEngine, parserFactory);
const atsRouter = new ATSRouter(atsController);

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/ats', atsRouter.router);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT} (SOLID + OOP architecture)`);
});
