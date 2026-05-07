import React from 'react';

/**
 * ResumePreview — Professional resume preview matching the academic/tech template.
 * 
 * Style: Serif typography, table-like layout for education and projects, 
 * inline blue links, and strict ATS-friendly formatting.
 */

interface ResumePreviewProps {
  data: any;
}

export function ResumePreview({ data }: ResumePreviewProps) {
  if (!data || Object.keys(data).length === 0) {
    return <EmptyState />;
  }

  const { basics, skills, experience, projects, education, certifications, achievements } = data;

  // Flatten skills
  const skillCategories: { label: string; items: string[] }[] = [];
  if (skills) {
    const cats = [
      { label: 'Languages', items: skills.languages },
      { label: 'Frameworks', items: skills.frameworks },
      { label: 'Tools', items: skills.tools },
      { label: 'Databases', items: skills.databases },
      { label: 'Cloud', items: skills.cloud },
      { label: 'Other', items: skills.other },
    ];
    cats.forEach(c => { if (c.items?.length > 0) skillCategories.push(c); });
  }

  return (
    <div className="h-full overflow-y-auto bg-neutral-100 p-4 md:p-8">
      <div className="bg-white border border-neutral-300 shadow-md max-w-[850px] mx-auto min-h-[1100px]">
        {/* Resume content — Styled purely with standard CSS for PDF portability */}
        <div className="px-12 py-12" style={{ fontFamily: "'Times New Roman', Times, serif", fontSize: '11pt', lineHeight: 1.4, color: '#000' }}>
          
          {/* ── Header ── */}
          {basics && (
            <div style={{ marginBottom: '16px', position: 'relative' }}>
              <h1 style={{ fontSize: '26pt', fontWeight: 700, margin: '0 0 6px 0', letterSpacing: '0.5px' }}>
                {basics.fullName || 'Your Name'}
              </h1>
              
              <div style={{ fontSize: '10.5pt', lineHeight: 1.5 }}>
                {basics.phone && <div><strong>Phone:</strong> {basics.phone}</div>}
                {basics.email && <div><strong>Email:</strong> {basics.email}</div>}
                
                <div style={{ marginTop: '4px' }}>
                  {basics.linkedin && <a href={basics.linkedin} style={{ color: '#1C4ED6', textDecoration: 'none' }}>LinkedIn</a>}
                  {basics.linkedin && basics.github && <Dot />}
                  {basics.github && <a href={basics.github} style={{ color: '#1C4ED6', textDecoration: 'none' }}>Github</a>}
                  {((basics.linkedin || basics.github) && basics.portfolio) && <Dot />}
                  {basics.portfolio && <a href={basics.portfolio} style={{ color: '#1C4ED6', textDecoration: 'none' }}>Portfolio</a>}
                </div>
              </div>

              {/* Optional Logos (Top Right) */}
              <div style={{ position: 'absolute', top: 0, right: 0, display: 'flex', gap: '10px' }}>
                {/* Placeholder for user-added logos. The prompt mentioned it's optional. */}
              </div>
            </div>
          )}

          {/* ── Professional Summary ── */}
          {basics?.summary && (
            <Section title="PROFESSIONAL SUMMARY">
              <p style={{ textAlign: 'justify', marginBottom: 0 }}>{basics.summary}</p>
            </Section>
          )}

          {/* ── Education ── */}
          {education && education.length > 0 && (
            <Section title="EDUCATION">
              {education.map((edu: any, idx: number) => (
                <div key={idx} style={{ marginBottom: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong style={{ fontSize: '11pt' }}>{edu.degree} {edu.fieldOfStudy ? `(${edu.fieldOfStudy})` : ''}</strong>
                    <span>{edu.startDate ? `${edu.startDate} - ${edu.endDate || 'Present'}` : ''}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{edu.institution}</span>
                    {edu.grade && <span>Grade: {edu.grade}</span>}
                  </div>
                </div>
              ))}
            </Section>
          )}

          {/* ── Experience ── */}
          {experience && experience.length > 0 && (
            <Section title="EXPERIENCE">
              {experience.map((exp: any, idx: number) => (
                <div key={idx} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <strong>{exp.role}</strong>
                    <span>{exp.startDate} — {exp.isCurrent ? 'Present' : (exp.endDate || 'Present')}</span>
                  </div>
                  <div style={{ fontStyle: 'italic', marginBottom: '4px' }}>
                    {exp.company} {exp.location ? `, ${exp.location}` : ''}
                  </div>
                  {exp.description && <p style={{ margin: '4px 0 0 0', fontStyle: 'italic' }}>{exp.description}</p>}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0' }}>
                      {exp.achievements.map((a: string, i: number) => (
                        <li key={i} style={{ marginBottom: '3px' }}>{a}</li>
                      ))}
                    </ul>
                  )}
                  {exp.technologies && exp.technologies.length > 0 && (
                    <div style={{ fontSize: '10pt', marginTop: '4px' }}>
                      <strong>Technologies:</strong> {exp.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* ── Projects ── */}
          {projects && projects.length > 0 && (
            <Section title="PROJECTS">
              {projects.map((proj: any, idx: number) => (
                <div key={idx} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <strong>{proj.name}</strong>
                      {proj.links?.github && (
                        <span style={{ marginLeft: '6px' }}>
                          ( <a href={proj.links.github} style={{ color: '#1C4ED6', textDecoration: 'none' }}>Github</a> )
                        </span>
                      )}
                      {proj.links?.live && (
                        <span style={{ marginLeft: '4px' }}>
                          ( <a href={proj.links.live} style={{ color: '#1C4ED6', textDecoration: 'none' }}>Demo</a> )
                        </span>
                      )}
                    </div>
                    {(proj.startDate || proj.endDate) && (
                      <span>{proj.startDate || ''}{proj.endDate ? ` — ${proj.endDate}` : ''}</span>
                    )}
                  </div>
                  {proj.description && <p style={{ margin: '4px 0', fontStyle: 'italic' }}>{proj.description}</p>}
                  {proj.impact && proj.impact.length > 0 && (
                    <ul style={{ paddingLeft: '20px', margin: '4px 0 0 0' }}>
                      {proj.impact.map((a: string, i: number) => (
                        <li key={i} style={{ marginBottom: '3px' }}>{a}</li>
                      ))}
                    </ul>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div style={{ fontSize: '10pt', marginTop: '4px' }}>
                      <strong>Technologies:</strong> {proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </Section>
          )}

          {/* ── Skills ── */}
          {skillCategories.length > 0 && (
            <Section title="TECHNICAL SKILLS">
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '4px 0' }}>
                {skillCategories.map((cat, idx) => (
                  <React.Fragment key={idx}>
                    <strong>{cat.label}:</strong>
                    <span>{cat.items.join(', ')}</span>
                  </React.Fragment>
                ))}
              </div>
            </Section>
          )}

          {/* ── Certifications ── */}
          {certifications && certifications.length > 0 && (
            <Section title="CERTIFICATIONS">
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {certifications.map((cert: any, idx: number) => (
                  <li key={idx} style={{ marginBottom: '4px' }}>
                    <strong>{cert.name}</strong>
                    {cert.issuer && ` — ${cert.issuer}`}
                    {cert.issueDate && ` (${cert.issueDate})`}
                    {cert.credentialUrl && (
                      <span style={{ marginLeft: '6px' }}>
                        [ <a href={cert.credentialUrl} style={{ color: '#1C4ED6', textDecoration: 'none' }}>Credential</a> ]
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* ── Achievements ── */}
          {achievements && achievements.length > 0 && (
            <Section title="ACHIEVEMENTS">
              <ul style={{ paddingLeft: '20px', margin: 0 }}>
                {achievements.map((a: string, idx: number) => (
                  <li key={idx} style={{ marginBottom: '3px' }}>{a}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Section header matching the reference image ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h2 style={{
        fontSize: '12pt',
        fontWeight: 700,
        margin: '0 0 6px 0',
        paddingBottom: '2px',
        borderBottom: '1px solid #000',
        textTransform: 'uppercase'
      }}>
        {title}
      </h2>
      {children}
    </div>
  );
}

/* ── Separator dot ── */
function Dot() {
  return <span style={{ margin: '0 8px', color: '#000', fontWeight: 'bold' }}>•</span>;
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="bg-white/40 backdrop-blur-sm rounded-[20px] border-2 border-dashed border-neutral-300 p-10 text-center max-w-md shadow-sm">
        <div className="w-16 h-16 rounded-[20px] bg-white border border-neutral-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10,9 9,9 8,9" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2 font-manrope">Live Preview</h3>
        <p className="text-sm text-neutral-500 font-medium leading-relaxed">
          Your professional resume will build itself here in real-time as you chat with the AI assistant.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          {['Personal Info', 'Experience', 'Education', 'Skills', 'Projects', 'Certifications'].map((t, i) => (
            <div key={t} className="flex items-center gap-2 text-xs text-neutral-600 font-bold font-manrope">
              <span className="w-5 h-5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center text-[9px]">{i + 1}</span>
              {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
