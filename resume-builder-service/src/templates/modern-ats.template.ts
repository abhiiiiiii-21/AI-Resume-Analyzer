import { ResumeData } from '../types/resume.types';

/**
 * Modern ATS Resume Template
 * 
 * Generates clean, ATS-friendly HTML from structured resume data.
 * Updated to match the professional/academic layout in the frontend preview.
 */
export function renderModernAtsTemplate(resume: ResumeData): string {
    const { basics, skills, experience, projects, education, certifications, achievements } = resume;

    // Flatten skills
    const skillCategories: { label: string; items: string[] }[] = [];
    if (skills) {
        if (skills.languages?.length) skillCategories.push({ label: 'Languages', items: skills.languages });
        if (skills.frameworks?.length) skillCategories.push({ label: 'Frameworks', items: skills.frameworks });
        if (skills.tools?.length) skillCategories.push({ label: 'Tools', items: skills.tools });
        if (skills.databases?.length) skillCategories.push({ label: 'Databases', items: skills.databases });
        if (skills.cloud?.length) skillCategories.push({ label: 'Cloud', items: skills.cloud });
        if (skills.other?.length) skillCategories.push({ label: 'Other', items: skills.other });
    }

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${basics?.fullName || 'Resume'}</title>
  <style>
    /* ── Reset & Base ── */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 11pt;
      line-height: 1.4;
      color: #000;
      max-width: 850px;
      margin: 0 auto;
      padding: 40px 50px;
    }

    /* ── Header ── */
    .header {
      margin-bottom: 16px;
      position: relative;
    }

    .header h1 {
      font-size: 26pt;
      font-weight: 700;
      margin: 0 0 6px 0;
      letter-spacing: 0.5px;
    }

    .contact-info {
      font-size: 10.5pt;
      line-height: 1.5;
    }

    .contact-info a {
      color: #1C4ED6;
      text-decoration: none;
    }

    .dot {
      margin: 0 8px;
      color: #000;
      font-weight: bold;
    }

    /* ── Sections ── */
    .section {
      margin-bottom: 16px;
    }

    .section-title {
      font-size: 12pt;
      font-weight: 700;
      margin: 0 0 6px 0;
      padding-bottom: 2px;
      border-bottom: 1px solid #000;
      text-transform: uppercase;
    }

    /* ── Utilities ── */
    .flex-between {
      display: flex;
      justify-content: space-between;
    }

    .mb-item {
      margin-bottom: 12px;
    }
    .mb-sm {
      margin-bottom: 10px;
    }

    .bold { font-weight: 700; }
    .italic { font-style: italic; }
    
    ul {
      padding-left: 20px;
      margin: 4px 0 0 0;
    }
    
    li {
      margin-bottom: 3px;
    }

    a {
      color: #1C4ED6;
      text-decoration: none;
    }

    .skills-grid {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 4px 0;
    }
  </style>
</head>
<body>

  <!-- Header -->
  ${basics ? `
  <div class="header">
    <h1>${basics.fullName || 'Your Name'}</h1>
    <div class="contact-info">
      ${basics.phone ? `<div><strong>Phone:</strong> ${basics.phone}</div>` : ''}
      ${basics.email ? `<div><strong>Email:</strong> ${basics.email}</div>` : ''}
      <div style="margin-top: 4px;">
        ${basics.linkedin ? `<a href="${basics.linkedin}">LinkedIn</a>` : ''}
        ${basics.linkedin && basics.github ? `<span class="dot">•</span>` : ''}
        ${basics.github ? `<a href="${basics.github}">Github</a>` : ''}
        ${(basics.linkedin || basics.github) && basics.portfolio ? `<span class="dot">•</span>` : ''}
        ${basics.portfolio ? `<a href="${basics.portfolio}">Portfolio</a>` : ''}
      </div>
    </div>
  </div>
  ` : ''}

  <!-- Summary -->
  ${basics?.summary ? `
  <div class="section">
    <h2 class="section-title">PROFESSIONAL SUMMARY</h2>
    <p style="text-align: justify; margin-bottom: 0;">${basics.summary}</p>
  </div>
  ` : ''}

  <!-- Education -->
  ${education && education.length > 0 ? `
  <div class="section">
    <h2 class="section-title">EDUCATION</h2>
    ${education.map(edu => `
      <div class="mb-sm">
        <div class="flex-between">
          <strong style="font-size: 11pt;">${edu.degree} ${edu.fieldOfStudy ? `(${edu.fieldOfStudy})` : ''}</strong>
          <span>${edu.startDate ? `${edu.startDate} - ${edu.endDate || 'Present'}` : ''}</span>
        </div>
        <div class="flex-between">
          <span>${edu.institution}</span>
          ${edu.grade ? `<span>Grade: ${edu.grade}</span>` : ''}
        </div>
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Experience -->
  ${experience && experience.length > 0 ? `
  <div class="section">
    <h2 class="section-title">EXPERIENCE</h2>
    ${experience.map(exp => `
      <div class="mb-item">
        <div class="flex-between">
          <strong>${exp.role}</strong>
          <span>${exp.startDate} — ${exp.isCurrent ? 'Present' : (exp.endDate || 'Present')}</span>
        </div>
        <div class="italic" style="margin-bottom: 4px;">
          ${exp.company} ${exp.location ? `, ${exp.location}` : ''}
        </div>
        ${exp.description ? `<p class="italic" style="margin: 4px 0 0 0;">${exp.description}</p>` : ''}
        ${exp.achievements && exp.achievements.length > 0 ? `
          <ul>
            ${exp.achievements.map(a => `<li>${a}</li>`).join('')}
          </ul>
        ` : ''}
        ${exp.technologies && exp.technologies.length > 0 ? `
          <div style="font-size: 10pt; margin-top: 4px;">
            <strong>Technologies:</strong> ${exp.technologies.join(', ')}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Projects -->
  ${projects && projects.length > 0 ? `
  <div class="section">
    <h2 class="section-title">PROJECTS</h2>
    ${projects.map(proj => `
      <div class="mb-item">
        <div class="flex-between">
          <div>
            <strong>${proj.name}</strong>
            ${proj.links?.github ? `<span style="margin-left: 6px;">( <a href="${proj.links.github}">Github</a> )</span>` : ''}
            ${proj.links?.live ? `<span style="margin-left: 4px;">( <a href="${proj.links.live}">Demo</a> )</span>` : ''}
          </div>
          ${(proj.startDate || proj.endDate) ? `<span>${proj.startDate || ''}${proj.endDate ? ` — ${proj.endDate}` : ''}</span>` : ''}
        </div>
        ${proj.description ? `<p class="italic" style="margin: 4px 0;">${proj.description}</p>` : ''}
        ${proj.impact && proj.impact.length > 0 ? `
          <ul>
            ${proj.impact.map(a => `<li>${a}</li>`).join('')}
          </ul>
        ` : ''}
        ${proj.technologies && proj.technologies.length > 0 ? `
          <div style="font-size: 10pt; margin-top: 4px;">
            <strong>Technologies:</strong> ${proj.technologies.join(', ')}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}

  <!-- Skills -->
  ${skillCategories.length > 0 ? `
  <div class="section">
    <h2 class="section-title">TECHNICAL SKILLS</h2>
    <div class="skills-grid">
      ${skillCategories.map(cat => `
        <strong>${cat.label}:</strong>
        <span>${cat.items.join(', ')}</span>
      `).join('')}
    </div>
  </div>
  ` : ''}

  <!-- Certifications -->
  ${certifications && certifications.length > 0 ? `
  <div class="section">
    <h2 class="section-title">CERTIFICATIONS</h2>
    <ul style="margin: 0;">
      ${certifications.map(cert => `
        <li style="margin-bottom: 4px;">
          <strong>${cert.name}</strong>
          ${cert.issuer ? ` — ${cert.issuer}` : ''}
          ${cert.issueDate ? ` (${cert.issueDate})` : ''}
          ${cert.credentialUrl ? `<span style="margin-left: 6px;">[ <a href="${cert.credentialUrl}">Credential</a> ]</span>` : ''}
        </li>
      `).join('')}
    </ul>
  </div>
  ` : ''}

  <!-- Achievements -->
  ${achievements && achievements.length > 0 ? `
  <div class="section">
    <h2 class="section-title">ACHIEVEMENTS</h2>
    <ul style="margin: 0;">
      ${achievements.map(a => `<li>${a}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

</body>
</html>`;
}
