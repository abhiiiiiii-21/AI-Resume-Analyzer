import puppeteer from 'puppeteer';
import fs from "fs";
import path from "path";
import { IPDFGenerator } from "../interfaces/IPDFGenerator";
import { ResumeTemplate } from "../templates/ResumeTemplate";

/**
 * SOLID — S (Single Responsibility): Only job is creating a PDF using Puppeteer.
 * SOLID — D (Dependency Inversion): Implements IPDFGenerator interface.
 */
export class PuppeteerGenerator implements IPDFGenerator {
  async generate(data: any, fileName: string): Promise<string> {
    const uploadDir = path.resolve("uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);

    // 1. Generate HTML from data
    const htmlContent = ResumeTemplate(data);

    // 2. Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
      const page = await browser.newPage();
      
      // Set content and wait for it to be loaded
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      // Generate PDF with professional margins
      await page.pdf({
        path: filePath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '40px',
          bottom: '40px',
          left: '50px',
          right: '50px'
        }
      });

      return filePath;
    } finally {
      await browser.close();
    }
  }
}
