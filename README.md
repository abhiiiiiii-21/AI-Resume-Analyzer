# Talvix
> Elevate your career with intelligent, AI-powered resume analysis.

## Overview
Talvix is a modern web application designed to empower professionals by providing an intelligent platform for resume analysis and enhancement. Built with a focus on user experience and cutting-edge technology, Talvix streamlines the process of evaluating and improving resumes, offering actionable insights to help users stand out in today's competitive job market.

## Features
- **Secure Authentication**: Seamless and secure sign-in/sign-up flows utilizing Clerk, supporting both Google OAuth and standard email authentication.
- **Intuitive Dashboard**: A centralized, user-friendly hub for managing profiles, viewing analysis history, and accessing core tools.
- **AI Enhancement Module**: The core feature that analyzes resume content, providing intelligent feedback, keyword optimization, and formatting suggestions.
- **Premium UI/UX**: A clean, modern, and responsive interface crafted with Tailwind CSS and Next.js, ensuring a seamless experience across all devices.

## Tech Stack
- **Frontend**: React, Next.js, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Prisma
- **Authentication**: Clerk
- **AI/ML**: Integration with advanced LLM APIs for resume analysis
- **Database**: PostgreSQL (via Prisma)

## Project Structure
```text
talvix/
├── backend/                  # Node.js backend services and API routes
│   ├── prisma/               # Database schema and migrations
│   └── src/                  # Backend source code and controllers
├── frontend/                 # Next.js frontend application
│   ├── app/                  # Application routing and pages
│   ├── components/           # Reusable React components (UI, layout, etc.)
│   └── lib/                  # Utility functions and shared logic
├── resume-builder-service/   # Dedicated microservice for resume generation
└── diagrams/                 # Architecture and application flow diagrams
```

## Application Flow
1. **Landing Page**: Users are introduced to Talvix's value proposition and core features.
2. **Authentication**: Users sign up or log in securely via Clerk (Google or Email).
3. **Dashboard**: Upon authentication, users are redirected to their personalized dashboard to view past analyses or start a new one.
4. **Enhancement Module**: Users upload their resume or input their data. The AI processes the information and presents a detailed, actionable enhancement report.
5. **Export**: Users can export their optimized resume or save the feedback for future reference.

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL (or your configured database)

### Standard Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/talvix.git
   cd talvix
   ```

2. **Install dependencies**
   Navigate to both the frontend and backend directories to install necessary packages.
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in both the `frontend` and `backend` directories based on the provided `.env.example` files (see Environment Variables section below).

4. **Run the application**
   You will need to start both the frontend and backend development servers.
   ```bash
   # Start the backend server
   cd backend
   npm run dev

   # Start the frontend server (in a new terminal)
   cd frontend
   npm run dev
   ```

## Environment Variables

Ensure the following environment variables are correctly configured in your `.env` files before running the application.

| Variable | Description | Location |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public authentication key | `frontend` |
| `CLERK_SECRET_KEY` | Clerk secret API key | `frontend` |
| `DATABASE_URL` | Connection string for the database | `backend` |
| `AI_SERVICE_API_KEY` | API key for the AI analysis module | `backend` |
| `PORT` | Backend server port (default: 3001) | `backend` |

## Future Improvements
- Expanded AI capabilities, including cover letter generation and interview preparation.
- Integration with external job boards for direct application submissions.
- Enhanced analytics tracking for user engagement and feature usage.
- Advanced export options (e.g., direct to PDF, Word, or specific ATS formats).

## Contributing
Contributions are welcome! Please follow these steps to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## License
Distributed under the MIT License. See `LICENSE` for more information.

## Author
**Abhishek Kumar Patel**
- GitHub: [@abhiiiiiii-21](https://github.com/abhiiiiiii-21)
