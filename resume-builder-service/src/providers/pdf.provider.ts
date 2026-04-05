import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

/**
 * PdfProvider
 * 
 * The ONLY class that directly uses Puppeteer.
 * Takes an HTML string and converts it to a PDF buffer/file.
 * 
 * Why isolate Puppeteer?
 * - Puppeteer is heavy — keeping it in one place limits its impact
 * - Easy to swap to another PDF library later if needed
 * - Centralized config for page size, margins, etc.
 */
export class PdfProvider {
    /**
     * Generate a PDF from an HTML string and save it to disk.
     * 
     * @param html - Complete HTML document string
     * @param outputPath - Where to save the PDF file
     * @returns The absolute path to the saved PDF
     */
    async generatePdf(html: string, outputPath: string): Promise<string> {
        // Ensure the output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Launch a headless browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });

        try {
            const page = await browser.newPage();

            // Set the HTML content
            await page.setContent(html, { waitUntil: 'networkidle0' });

            // Generate PDF with professional settings
            await page.pdf({
                path: outputPath,
                format: 'A4',
                printBackground: true,
                margin: {
                    top: '0.4in',
                    right: '0.4in',
                    bottom: '0.4in',
                    left: '0.4in',
                },
            });

            console.log(`[PdfProvider] PDF generated: ${outputPath}`);
            return outputPath;
        } finally {
            // Always close the browser to prevent memory leaks
            await browser.close();
        }
    }
}
