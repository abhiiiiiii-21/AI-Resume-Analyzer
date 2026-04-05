import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ResumeRepository } from '../repositories/resume.repository';
import { ResumeAssetRepository } from '../repositories/resume-asset.repository';
import { PdfProvider } from '../providers/pdf.provider';
import { renderModernAtsTemplate } from '../templates/modern-ats.template';
import { ResumeData } from '../types/resume.types';
import { AppError } from '../utils/app-error';

/**
 * ResumePdfService
 * 
 * Orchestrates PDF generation for finalized resumes.
 * 
 * Flow:
 * 1. Load the finalized resume
 * 2. Select the HTML template based on templateKey
 * 3. Render resume data into HTML
 * 4. Use PdfProvider (Puppeteer) to convert HTML → PDF
 * 5. Save the PDF file to the uploads directory
 * 6. Save the file reference in the database
 * 7. Update the resume record with the PDF URL
 */
export class ResumePdfService {
    private resumeRepo: ResumeRepository;
    private assetRepo: ResumeAssetRepository;
    private pdfProvider: PdfProvider;

    constructor() {
        this.resumeRepo = new ResumeRepository();
        this.assetRepo = new ResumeAssetRepository();
        this.pdfProvider = new PdfProvider();
    }

    /**
     * Generate a PDF for a finalized resume.
     * 
     * @param resumeId - The resume to generate PDF for
     * @param userId - The user who owns it (for access check)
     * @returns The path/URL to the generated PDF
     */
    async generatePdf(resumeId: string, userId: string): Promise<string> {
        // 1. Load the resume (with ownership check)
        const resume = await this.resumeRepo.findByIdAndUser(resumeId, userId);
        if (!resume) {
            throw new AppError('Resume not found', 404);
        }

        const resumeData = resume.resumeJson as ResumeData;

        // 2. Render HTML using the appropriate template
        const html = this.renderTemplate(resume.templateKey, resumeData);

        // 3. Generate a unique filename
        const filename = `resume-${resumeId}-${uuidv4().slice(0, 8)}.pdf`;
        const uploadsDir = path.resolve(__dirname, '..', 'uploads');
        const outputPath = path.join(uploadsDir, filename);

        // 4. Generate the PDF file
        await this.pdfProvider.generatePdf(html, outputPath);

        // 5. Calculate the public URL/path
        const pdfUrl = `/uploads/resumes/${filename}`;

        // 6. Save the asset record
        await this.assetRepo.create({
            resumeId,
            assetType: 'PDF',
            storagePath: outputPath,
        });

        // 7. Update the resume with the PDF URL
        await this.resumeRepo.update(resumeId, { pdfUrl });

        return pdfUrl;
    }

    /**
     * Render HTML using the specified template.
     * Currently only supports 'modern-ats'.
     * More templates can be added here later.
     */
    private renderTemplate(templateKey: string, resumeData: ResumeData): string {
        switch (templateKey) {
            case 'modern-ats':
            default:
                return renderModernAtsTemplate(resumeData);
        }
    }
}
