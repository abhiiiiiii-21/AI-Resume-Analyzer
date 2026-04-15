import { Request, Response } from 'express';
import { ATSEngine } from '../services/ATSEngine';
import { ParserFactory } from '../parsers/ParserFactory';

// SRP: Only responsible for HTTP request/response handling
// DIP: Depends on abstractions injected via constructor
export class ATSController {
  constructor(
    private engine: ATSEngine,
    private parserFactory: ParserFactory
  ) {}

  calculateFromText = async (req: Request, res: Response): Promise<void> => {
    try {
      const { resumeText, jobSkills } = req.body;
      if (!resumeText || !jobSkills) {
        res.status(400).json({ error: 'resumeText and jobSkills are required' });
        return;
      }
      const result = this.engine.calculateMatch(resumeText, jobSkills);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Internal Server Error' });
    }
  };

  calculateFromFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const file = (req as any).file;
      const { jobSkills } = req.body;

      if (!file || !jobSkills) {
        res.status(400).json({ error: 'resumeFile and jobSkills are required' });
        return;
      }

      const parser = this.parserFactory.getParser(file.mimetype);
      const resumeText = await parser.extractText(file.buffer);

      if (!resumeText.trim()) {
        res.status(400).json({ error: 'Could not extract text from the provided file.' });
        return;
      }

      const result = this.engine.calculateMatch(resumeText, jobSkills);
      res.status(200).json(result);
    } catch (err: any) {
      res.status(err.message?.includes('Unsupported') ? 415 : 500).json({
        error: err.message || 'Internal Server Error',
      });
    }
  };
}
