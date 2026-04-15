import { Router } from 'express';
import multer from 'multer';
import { ATSController } from '../controllers/ATSController';

// SRP: Only sets up routes and middleware
export class ATSRouter {
  public router: Router;
  private upload = multer({ storage: multer.memoryStorage() });

  constructor(private controller: ATSController) {
    this.router = Router();
    this.registerRoutes();
  }

  private registerRoutes(): void {
    this.router.post('/calculate', this.controller.calculateFromText);
    this.router.post(
      '/calculate-file',
      this.upload.single('resumeFile'),
      this.controller.calculateFromFile
    );
  }
}
