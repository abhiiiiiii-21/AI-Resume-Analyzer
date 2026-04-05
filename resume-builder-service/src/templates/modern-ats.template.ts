import { ResumeData } from '../types/resume.types';

/**
 * Modern ATS Resume Template
 * 
 * Generates clean, ATS-friendly HTML from structured resume data.
 * 
 * Design principles:
 * - Single-column layout (best for ATS parsing)
 * - Clean typography with system fonts
 * - No images, icons, or complex CSS (ATS can't read them)
 * - Proper heading hierarchy (h1 > h2 > h3)
 * - Simple professional structure
 * - Printable at standard paper sizes
 * 
 * This template can be swapped out later by using different template keys.
 */

/**
 * Render a ResumeData object into a complete HTML document.
 * This HTML is passed to Puppeteer to generate the PDF.
 */
export function renderModernAtsTemplate(resume: ResumeData): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${resume.basics.fullName || 'Resume'}</title>
  <style>
    /* ── Reset & Base ── */
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 11pt;
      line-height: 1.5;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 50px;
    }

    /* ── Header / Name ── */
    .header {
      text-align: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #2c3e50;
      padding-bottom: 15px;
    }

    .header h1 {
      font-size: 22pt;
      color: #2c3e50;
      margin-bottom: 4px;
      letter-spacing: 1px;
    }

    .header .headline {
      font-size: 12pt;
      color: #555;
      margin-bottom: 8px;
    }

    .contact-info {
      font-size: 9.5pt;
      color: #666;
    }

    .contact-info span {
      margin: 0 6px;
    }

    .contact-info a {
      color: #2c3e50;
      text-decoration: none;
    }

    /* ── Sections ── */
    .section {
      margin-bottom: 18px;
    }

    .section-title {
      font-size: 13pt;
      font-weight: 700;
      color: #2c3e50;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid #bdc3c7;
      padding-bottom: 3px;
      margin-bottom: 10px;
    }

    /* ── Summary ── */
    .summary {
      font-size: 10.5pt;
      color: #444;
      line-height: 1.6;
    }

    /* ── Experience / Projects / Education ── */
    .entry {
      margin-bottom: 12px;
    }

    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }

    .entry-title {
      font-weight: 700;
      font-size: 11pt;
      color: #2c3e50;
    }

    .entry-subtitle {
      font-style: italic;
      color: #555;
      font-size: 10.5pt;
    }

    .entry-date {
      font-size: 10pt;
      color: #777;
      white-space: nowrap;
    }

    .entry ul {
      margin-top: 4px;
      padding-left: 18px;
    }

    .entry li {
      font-size: 10.5pt;
      margin-bottom: 2px;
      line-height: 1.4;
    }

    .tech-stack {
      font-size: 9.5pt;
      color: #666;
      margin-top: 3px;
    }

    /* ── Skills ── */
    .skills-grid {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 4px 15px;
      font-size: 10.5pt;
    }

    .skill-category {
      font-weight: 600;
      color: #2c3e50;
    }

    .skill-list {
      color: #444;
    }

    /* ── Certifications / Achievements ── */
    .compact-list {
      padding-left: 18px;
    }

    .compact-list li {
      font-size: 10.5pt;
      margin-bottom: 2px;
    }

    /* ── Print ── */
    @media print {
      body { padding: 20px 30px; }
    }
  </style>
</head>
<body>

  <!-- Header -->
  <div class="header">
    <h1>${resume.basics.fullName || ''}</h1>
    ${resume.basics.headline ? `<div class="headline">${resume.basics.headline}</div>` : ''}
    <div class="contact-info">
      ${resume.basics.email ? `<span>${resume.basics.email}</span>` : ''}
      ${resume.basics.phone ? `<span>| ${resume.basics.phone}</span>` : ''}
      ${resume.basics.location ? `<span>| ${resume.basics.location}</span>` : ''}
      ${resume.basics.linkedin ? `<span>| <a href="${resume.basics.linkedin}">LinkedIn</a></span>` : ''}
      ${resume.basics.github ? `<span>| <a href="${resume.basics.github}">GitHub</a></span>` : ''}
      ${resume.basics.portfolio ? `<span>| <a href="${resume.basics.portfolio}">Portfolio</a></span>` : ''}
    </div>
  </div>

  <!-- Summary -->
  ${resume.basics.summary ? `
  <div class="section">
    <h2 class="section-title">Professional Summary</h2>
    <p class="summary">${resume.basics.summary}</p>
  </div>
  ` : ''}

  <!-- Skills -->
  ${renderSkillsSection(resume.skills)}

  <!-- Experience -->
  ${renderExperienceSection(resume.experience)}

  <!-- Projects -->
  ${renderProjectsSection(resume.projects)}

  <!-- Education -->
  ${renderEducationSection(resume.education)}

  <!-- Certifications -->
  ${renderCertificationsSection(resume.certifications)}

  <!-- Achievements -->
  ${resume.achievements.length > 0 ? `
  <div class="section">
    <h2 class="section-title">Achievements</h2>
    <ul class="compact-list">
      ${resume.achievements.map((a) => `<li>${a}</li>`).join('')}
    </ul>
  </div>
  ` : ''}

</body>
</html>`;
}

/** Render the skills section */
function renderSkillsSection(skills: ResumeData['skills']): string {
    const categories = [
        { label: 'Languages', items: skills.languages },
        { label: 'Frameworks', items: skills.frameworks },
        { label: 'Tools', items: skills.tools },
        { label: 'Databases', items: skills.databases },
        { label: 'Cloud', items: skills.cloud },
        { label: 'Other', items: skills.other },
    ].filter((c) => c.items.length > 0);

    if (categories.length === 0) return '';

    return `
  <div class="section">
    <h2 class="section-title">Technical Skills</h2>
    <div class="skills-grid">
      ${categories
            .map(
                (c) => `
        <span class="skill-category">${c.label}:</span>
        <span class="skill-list">${c.items.join(', ')}</span>
      `
            )
            .join('')}
    </div>
  </div>`;
}

/** Render the experience section */
function renderExperienceSection(experience: ResumeData['experience']): string {
    if (experience.length === 0) return '';

    return `
  <div class="section">
    <h2 class="section-title">Experience</h2>
    ${experience
            .map(
                (exp) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <span class="entry-title">${exp.role}</span>
          <span class="entry-subtitle"> — ${exp.company}</span>
          ${exp.location ? `<span class="entry-subtitle">, ${exp.location}</span>` : ''}
        </div>
        <span class="entry-date">${formatDateRange(exp.startDate, exp.endDate, exp.isCurrent)}</span>
      </div>
      ${exp.achievements && exp.achievements.length > 0
                        ? `<ul>${exp.achievements.map((a) => `<li>${a}</li>`).join('')}</ul>`
                        : ''
                    }
      ${exp.technologies && exp.technologies.length > 0
                        ? `<div class="tech-stack"><strong>Tech:</strong> ${exp.technologies.join(', ')}</div>`
                        : ''
                    }
    </div>
    `
            )
            .join('')}
  </div>`;
}

/** Render the projects section */
function renderProjectsSection(projects: ResumeData['projects']): string {
    if (projects.length === 0) return '';

    return `
  <div class="section">
    <h2 class="section-title">Projects</h2>
    ${projects
            .map(
                (proj) => `
    <div class="entry">
      <div class="entry-header">
        <span class="entry-title">${proj.name}</span>
        <span class="entry-date">${formatDateRange(proj.startDate, proj.endDate)}</span>
      </div>
      ${proj.description ? `<p style="font-size:10.5pt;margin-top:3px;">${proj.description}</p>` : ''}
      ${proj.impact && proj.impact.length > 0
                        ? `<ul>${proj.impact.map((i) => `<li>${i}</li>`).join('')}</ul>`
                        : ''
                    }
      ${proj.technologies.length > 0
                        ? `<div class="tech-stack"><strong>Tech:</strong> ${proj.technologies.join(', ')}</div>`
                        : ''
                    }
    </div>
    `
            )
            .join('')}
  </div>`;
}

/** Render the education section */
function renderEducationSection(education: ResumeData['education']): string {
    if (education.length === 0) return '';

    return `
  <div class="section">
    <h2 class="section-title">Education</h2>
    ${education
            .map(
                (edu) => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <span class="entry-title">${edu.degree}</span>
          ${edu.fieldOfStudy ? `<span class="entry-subtitle"> in ${edu.fieldOfStudy}</span>` : ''}
          <span class="entry-subtitle"> — ${edu.institution}</span>
        </div>
        <span class="entry-date">${formatDateRange(edu.startDate, edu.endDate)}</span>
      </div>
      ${edu.grade ? `<p style="font-size:10pt;color:#666;margin-top:2px;">Grade: ${edu.grade}</p>` : ''}
    </div>
    `
            )
            .join('')}
  </div>`;
}

/** Render the certifications section */
function renderCertificationsSection(certifications: ResumeData['certifications']): string {
    if (certifications.length === 0) return '';

    return `
  <div class="section">
    <h2 class="section-title">Certifications</h2>
    <ul class="compact-list">
      ${certifications
            .map(
                (cert) =>
                    `<li><strong>${cert.name}</strong>${cert.issuer ? ` — ${cert.issuer}` : ''}${cert.issueDate ? ` (${cert.issueDate})` : ''}</li>`
            )
            .join('')}
    </ul>
  </div>`;
}

/** Format a date range like "Jan 2023 — Present" */
function formatDateRange(start?: string, end?: string, isCurrent?: boolean): string {
    if (!start && !end) return '';
    const startStr = start || '';
    const endStr = isCurrent ? 'Present' : end || '';
    if (startStr && endStr) return `${startStr} — ${endStr}`;
    return startStr || endStr;
}
