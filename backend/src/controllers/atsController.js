const ATSEngine = require('../services/ATSEngine');
const { PDFParse } = require('pdf-parse');
const mammoth = require('mammoth');

const calculateATS = (req, res) => {
  try {
    const { resumeText, jobSkills } = req.body;
    
    if (!resumeText || !jobSkills) {
      return res.status(400).json({ error: 'resumeText and jobSkills are required' });
    }

    const engine = new ATSEngine();
    const result = engine.calculateMatch(resumeText, jobSkills);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const calculateATSFromFile = async (req, res) => {
  try {
    const { jobSkills } = req.body;
    const file = req.file;

    if (!file || !jobSkills) {
      return res.status(400).json({ error: 'resumeFile and jobSkills are required' });
    }

    let resumeText = '';
    
    if (file.mimetype === 'application/pdf') {
      const parser = new PDFParse({ data: file.buffer });
      const data = await parser.getText();
      resumeText = data.text;
      if (parser.destroy) {
        await parser.destroy();
      }
    } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.mimetype === 'application/msword') {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      resumeText = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Please upload a PDF or DOCX file.' });
    }

    if (!resumeText.trim()) {
      return res.status(400).json({ error: 'Could not extract text from the provided file.' });
    }

    const engine = new ATSEngine();
    const result = engine.calculateMatch(resumeText, jobSkills);

    return res.status(200).json({ ...result, extractedTextPreview: resumeText.substring(0, 100) + '...' });
  } catch (error) {
    console.error("Error parsing file:", error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

module.exports = { calculateATS, calculateATSFromFile };
