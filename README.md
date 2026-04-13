<div align="center">
  <br>
  <h1>R E S U M I N D</h1>
  <p>
    <b>An AI-powered resume analysis and enhancement platform.</b>
  </p>
  <p>
    <sub>
      One intelligent platform to analyze, optimize, and elevate your resume for modern hiring systems.
    </sub>
  </p>
  <br>
  <p>
    <img src="https://img.shields.io/badge/Node.js-111111?style=for-the-badge&logo=nodedotjs&logoColor=15803D">
    <img src="https://img.shields.io/badge/Next.js-111111?style=for-the-badge&logo=nextdotjs&logoColor=white">
    <img src="https://img.shields.io/badge/Prisma-111111?style=for-the-badge&logo=prisma&logoColor=white">
    <img src="https://img.shields.io/badge/PostgreSQL-111111?style=for-the-badge&logo=postgresql&logoColor=white">
    <img src="https://img.shields.io/badge/Clerk-111111?style=for-the-badge">
  </p>

  <br>
  <a href="#-project-overview">Project Overview</a> ✦
  <a href="#-key-features">Key Features</a> ✦
  <a href="#-system-architecture">Architecture</a> ✦
  <a href="#-system-architecture-diagrams">Diagrams</a> ✦
  <a href="#-project-structure">Structure</a> ✦
  <a href="#-installation">Installation</a> ✦
  <a href="#-api-flow">Flow</a> ✦
  <a href="#-tech-stack">Tech Stack</a>
  <br>
</div>

<hr>

## ◈ Project Overview

**Resumind** is an intelligent web application that helps users analyze, optimize, and enhance their resumes using AI.

Instead of manually editing resumes or guessing what recruiters want, Resumind provides a **structured, data-driven approach** to resume building. It evaluates content, improves formatting, enhances keyword relevance, and generates actionable insights to increase ATS (Applicant Tracking System) success rates.

The platform simplifies resume optimization into a seamless workflow — from upload to enhancement to export.

<br>

## ◈ Key Features

### Core Capabilities

| <kbd>01</kbd> Resume Analysis                                                                 | <kbd>02</kbd> ATS Optimization                                                                 |
|----------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| AI evaluates resume content and identifies weaknesses, gaps, and improvements.              | Optimizes keywords and formatting to improve ATS compatibility.                               |

| <kbd>03</kbd> Resume Enhancement                                                             | <kbd>04</kbd> Authentication                                                                  |
|---------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| AI rewrites and enhances resumes based on job descriptions and industry standards.         | Secure login/signup using Clerk (Google OAuth + Email authentication).                        |

<br>

### Platform Capabilities

- **Real-time Feedback** — Instant suggestions and improvements  
- **Structured Resume Builder** — Guided content creation  
- **Export System** — Download optimized resumes  
- **Dashboard Tracking** — Manage and revisit previous resumes  

<br>

### Coming Soon

| Capability | Impact |
|----------|--------|
| **Cover Letter Generator** | Generate personalized cover letters |
| **Interview Preparation** | AI-based mock interview system |
| **Job Matching** | Suggest relevant jobs based on resume |
| **Advanced Export** | PDF, Word, ATS-ready formats |

<br>

### Implementation Comparison

| Domain | Traditional Approach | Resumind |
|------|---------------------|----------|
| Resume Writing | Manual editing | AI-assisted optimization |
| ATS Compatibility | Guess-based | Data-driven keyword analysis |
| Feedback | Limited | Real-time AI insights |
| Efficiency | Time-consuming | Automated workflow |

<br>

## ◈ System Architecture

The system is designed with a modular service-based architecture:

- **Authentication Layer** — Handles user sessions via Clerk  
- **Resume Builder** — Manages templates and content creation  
- **ATS Service** — Analyzes resumes and generates scores  
- **Enhancer Service** — Uses AI to improve resume content  
- **Database Layer** — Stores users, resumes, and reports  

This layered architecture ensures scalability, maintainability, and clean separation of concerns.

<br>

## ◈ System Architecture Diagrams

<details>
<summary><b>View System Diagrams</b></summary>

<br>

<div align="center">

### UML Diagrams

![Class Diagram](./diagrams/Class_Diagram/final.png)
<br><br>

![Class Breakdown 1](./diagrams/Class_Diagram/1.png)
<br><br>
![Class Breakdown 2](./diagrams/Class_Diagram/2.png)
<br><br>

![Class Breakdown 3](./diagrams/Class_Diagram/3.png)
<br><br>
![Class Breakdown 4](./diagrams/Class_Diagram/4.png)
<br><br>

![Class Breakdown 5](./diagrams/Class_Diagram/5.png)
<br><br>
![Class Breakdown 6](./diagrams/Class_Diagram/6.png)

<br><br>

### Database Schema

![ER Diagram](./diagrams/ER_Diagram/1.png)
<br><br>
![ER Diagram](./diagrams/ER_Diagram/2.png)
<br><br>
![ER Diagram](./diagrams/ER_Diagram/3.png)
<br><br>
![ER Diagram](./diagrams/ER_Diagram/4.png)
<br><br>
![ER Diagram](./diagrams/ER_Diagram/5.png)

<br><br>

### Sequence Diagrams

![Sequence Diagram](./diagrams/Sequence_Diagram/1.png)
<br><br>
![Sequence Diagram](./diagrams/Sequence_Diagram/2.png)
<br><br>
![Sequence Diagram](./diagrams/Sequence_Diagram/3.png)
<br><br>
![Sequence Diagram](./diagrams/Sequence_Diagram/4.png)
<br><br>
![Sequence Diagram](./diagrams/Sequence_Diagram/5.png)

<br><br>

### Use Case Diagram

![Use Case Diagram](./diagrams/Use_Case_Diagram/1.png)
<br><br>
![Use Case Diagram](./diagrams/Use_Case_Diagram/2.png)
<br><br>
![Use Case Diagram](./diagrams/Use_Case_Diagram/3.png)
<br><br>
![Use Case Diagram](./diagrams/Use_Case_Diagram/4.png)
<br><br>
![Use Case Diagram](./diagrams/Use_Case_Diagram/5.png)
<br><br>
![Use Case Diagram](./diagrams/Use_Case_Diagram/6.png)

</div>

</details>

<br>

## ◈ Project Structure

```text
resumind/
├── backend/
│   ├── prisma/
│   └── src/
├── frontend/
│   ├── app/
│   ├── components/
│   └── lib/
├── diagrams/
│   ├── class/
│   ├── er/
│   ├── sequence/
│   └── usecase/
```

<br>

## ◈ Installation

Prerequisites: **Node.js v18+**, **PostgreSQL**

<details>
<summary><b>Initial Setup</b></summary>
<br>

1. Clone the repository

```bash
git clone https://github.com/yourusername/resumind.git
cd resumind
```

2. Install dependencies

```bash
cd backend
npm install

cd ../frontend
npm install
```

3. Configure Environment

Create `.env` files:

```env
DATABASE_URL=your_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_key
AI_SERVICE_API_KEY=your_key
PORT=3001
```

4. Run the project

```bash
# Backend
cd backend
npm run dev

# Frontend
cd frontend
npm run dev
```

</details>

<br>

## ◈ API Flow

```text
User → Authentication → Dashboard → Resume Upload → ATS Analysis → AI Enhancement → Output → Export
```

<br>

## ◈ Tech Stack

| Domain | Technology |
|---|---|
| **Frontend** | Next.js, React, Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL, Prisma |
| **Authentication** | Clerk |
| **AI** | LLM APIs |

<br>
<!-- <div align="center"> <i>Built for modern job seekers.</i> </div> -->