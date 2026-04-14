const ATSEngine = require('../services/ATSEngine');

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

module.exports = { calculateATS };
