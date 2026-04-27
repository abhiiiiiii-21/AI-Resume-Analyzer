export const ResumeTemplate = (data: any) => {
  const {
    name = "Full Name",
    email = "email@example.com",
    phone = "000-000-0000",
    links = [],
    summary = "",
    education = [],
    experience = [],
    projects = [],
    skills = [],
    extraCurricular = []
  } = data;

  // Helper to find skills by category for the new 2-column layout
  const getSkillItems = (category: string) => {
    const group = skills.find((s: any) => s.category.toLowerCase().includes(category.toLowerCase()));
    return group ? group.items.join(', ') : '';
  };

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        body {
            font-family: 'Inter', sans-serif;
            color: #000000;
            background: white;
            line-height: 1.4;
            font-size: 11px;
        }

        @media print {
            .page-break { page-break-after: always; }
        }
    </style>
</head>
<body class="p-0">
    <div class="max-w-[800px] mx-auto">
        <!-- HEADER -->
        <header class="text-center mb-6">
            <h1 class="text-2xl font-bold uppercase tracking-tight mb-1">${name}</h1>
            <div class="text-[10.5px] flex justify-center gap-2 items-center">
                <span>${phone}</span>
                <span class="text-gray-400">|</span>
                <span>${email}</span>
                ${links.length > 0 ? links.map((l: string) => `<span class="text-gray-400">|</span><span>${l}</span>`).join('') : ''}
            </div>
        </header>

        <!-- SUMMARY -->
        ${summary ? `
        <section class="mb-5">
            <h2 class="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-wide">Professional Summary</h2>
            <p class="text-justify">${summary}</p>
        </section>
        ` : ''}

        <!-- EDUCATION -->
        <section class="mb-5">
            <h2 class="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-wide">Education</h2>
            ${education.map((edu: any) => `
            <div class="mb-3">
                <div class="flex justify-between items-baseline mb-0.5">
                    <span class="text-[11.5px] font-bold">${edu.institution}</span>
                    <span class="text-[11px] font-medium">${edu.dates}</span>
                </div>
                <div class="flex justify-between items-baseline">
                    <span class="text-[11px] italic text-gray-600">${edu.degree}</span>
                    <span class="text-[11px] text-gray-600">${edu.location}</span>
                </div>
            </div>
            `).join('')}
        </section>

        <!-- EXPERIENCE -->
        <section class="mb-5">
            <h2 class="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-wide">Work Experience</h2>
            ${experience.map((exp: any) => `
            <div class="mb-4">
                <div class="flex justify-between items-baseline mb-0.5">
                    <span class="text-[11.5px] font-bold">${exp.company}</span>
                    <span class="text-[11px] font-medium">${exp.dates}</span>
                </div>
                <div class="flex justify-between items-baseline mb-1">
                    <span class="text-[11px] italic text-gray-600">${exp.role}</span>
                    <span class="text-[11px] text-gray-600">${exp.location}</span>
                </div>
                <ul class="list-none space-y-0.5">
                    ${exp.bullets.map((b: string) => `<li class="relative pl-4 text-justify before:content-['•'] before:absolute before:left-0 before:font-bold">${b}</li>`).join('')}
                </ul>
            </div>
            `).join('')}
        </section>

        <!-- PROJECTS -->
        ${projects.length > 0 ? `
        <section class="mb-5">
            <h2 class="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-wide">Projects</h2>
            ${projects.map((proj: any) => `
            <div class="mb-3">
                <div class="flex justify-between items-baseline mb-1">
                    <span class="text-[11.5px] font-bold">${proj.title}</span>
                    <span class="text-[11px] font-medium">${proj.dates || ''}</span>
                </div>
                <ul class="list-none space-y-0.5">
                    ${proj.bullets.map((b: string) => `<li class="relative pl-4 text-justify before:content-['•'] before:absolute before:left-0 before:font-bold">${b}</li>`).join('')}
                </ul>
            </div>
            `).join('')}
        </section>
        ` : ''}

        <!-- FIXED SKILLS SECTION -->
        <div class="mt-4">
            <h2 class="text-[13px] font-bold border-b border-black pb-1 mb-2 tracking-wide">
                SKILLS
            </h2>

            <div class="grid grid-cols-2 gap-x-10 text-[11.5px] leading-relaxed">
                <div class="space-y-1">
                    <p><span class="font-semibold">Programming Languages:</span> ${getSkillItems('Programming') || getSkillItems('Languages')}</p>
                    <p><span class="font-semibold">Software Packages:</span> ${getSkillItems('Software') || getSkillItems('Tools')}</p>
                </div>

                <div class="space-y-1">
                    <p><span class="font-semibold">Data Tools:</span> ${getSkillItems('Data')}</p>
                    <p><span class="font-semibold">Additional Courses:</span> ${getSkillItems('Course')}</p>
                    <p><span class="font-semibold">Others:</span> ${getSkillItems('Other')}</p>
                </div>
            </div>
        </div>

        <!-- EXTRA-CURRICULAR -->
        ${extraCurricular && extraCurricular.length > 0 ? `
        <section class="mt-5">
            <h2 class="text-[12px] font-bold uppercase border-b border-black pb-0.5 mb-2 tracking-wide">Extra-Curricular Activities</h2>
            <ul class="list-none space-y-0.5">
                ${extraCurricular.map((act: string) => `<li class="relative pl-4 text-justify before:content-['•'] before:absolute before:left-0 before:font-bold">${act}</li>`).join('')}
            </ul>
        </section>
        ` : ''}
    </div>
</body>
</html>
  `;
};
