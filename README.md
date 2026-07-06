# 🧭 CareerCompass AI – Autonomous Career Mentor

> **An AI-powered career mentoring platform that analyzes resumes, compares them against industry requirements, identifies skill gaps, evaluates ATS compatibility, and generates personalized career roadmaps using Google's Gemini 2.5 Flash.**

---

# 📖 Overview

CareerCompass AI is an AI-powered career guidance platform designed to help students, fresh graduates, and professionals understand how well their resumes align with today's job market.

Instead of simply scanning resumes, CareerCompass AI evaluates a candidate's profile, compares it with target job requirements, identifies missing skills, provides recruiter-style feedback, and generates personalized learning roadmaps to improve career readiness.

The application is built using **React**, **Vite**, **Tailwind CSS**, and **Google Gemini 2.5 Flash**, while keeping all user data private through a client-side architecture.

---

# ⚠️ Problem Statement

Today's job seekers face several challenges when applying for technical roles.

### 📄 Applicant Tracking Systems (ATS)

Most companies use Applicant Tracking Systems (ATS) to automatically filter resumes before recruiters review them. Candidates often receive no explanation when their resume is rejected because of missing keywords or poor alignment with job requirements.

### 📈 Rapidly Changing Industry Requirements

Technology evolves rapidly, making it difficult for candidates to understand which technical skills are currently in demand and how their profiles compare with industry expectations.

### 🎯 Lack of Personalized Career Guidance

Many resume analyzers identify missing skills but fail to provide a structured, personalized roadmap explaining what to learn next and how to improve based on an individual's background.

---

# 💡 Solution

CareerCompass AI addresses these challenges by providing an intelligent career mentoring experience that:

- 📄 Analyzes resumes using AI.
- 🎯 Matches resumes against target roles or job descriptions.
- 📊 Calculates ATS compatibility.
- 📉 Detects missing skills and important keywords.
- 📋 Generates recruiter-style feedback.
- 🛣️ Builds personalized 30-60-90 day learning roadmaps.
- 💼 Creates AI-powered mock interview preparation.

---

# 🤖 AI Agent Workflow

CareerCompass AI follows a multi-agent workflow where each AI agent performs a specialized task before passing its output to the next stage.

| AI Agent | Responsibility |
|-----------|----------------|
| 🛠️ **Profile Analysis Agent** | Extracts skills, education, projects, certifications, and professional experience from the uploaded resume. |
| 🎯 **Career Matching Agent** | Compares the candidate's profile against target roles or job descriptions, calculates ATS compatibility, and identifies critical skill gaps. |
| 📋 **Career Mentor Agent** | Generates recruiter-style feedback, creates personalized learning roadmaps, and prepares mock interview questions based on identified weaknesses. |

---

# 🔄 Application Workflow

```text
Upload Resume
      │
      ▼
Resume Analysis
      │
      ▼
Skill Extraction
      │
      ▼
Job Description Comparison
      │
      ▼
ATS Match Score
      │
      ▼
Skill Gap Analysis
      │
      ▼
Recruiter Feedback
      │
      ▼
30-60-90 Day Roadmap
      │
      ▼
Mock Interview Preparation
```

---

# ✨ Features

## 📄 AI Resume Analysis

- Resume upload
- Skill extraction
- Resume evaluation
- Recruiter-style feedback

## 🎯 Job Description Matcher

- Compare resume with job descriptions
- ATS compatibility score
- Missing keyword detection
- Resume improvement suggestions

## 📊 Career Dashboard

- Market alignment score
- Target role analysis
- Skill gap visualization
- Critical skills identification

## 🛣️ Personalized Learning Roadmap

Generates:

- 30-Day Learning Plan
- 60-Day Learning Plan
- 90-Day Learning Plan

Including:

- Learning resources
- Weekly goals
- Recommended projects
- Certifications

## 💼 AI Mock Interview

- Personalized interview questions
- Recruiter feedback
- Improvement suggestions

## 💾 Local Storage

- Saves previous analysis
- Stores learning roadmaps
- Preserves reports across browser sessions

## 🔒 Privacy First

- No backend server
- No cloud database
- API keys secured using `.env`
- Sensitive information never uploaded to GitHub

---

# 🛠️ Technology Stack

| Technology | Purpose |
|------------|---------|
| React 19 | Frontend Framework |
| Vite | Development & Build Tool |
| Tailwind CSS v4 | Styling |
| Framer Motion | Animations |
| Lucide React | Icons |
| Google Gemini 2.5 Flash | AI Engine |
| Local Storage | Persistent Data |

---

# 📸 Screenshots

## 🏠 Landing Page

<img width="1919" height="866" alt="image" src="https://github.com/user-attachments/assets/f7b5a40b-e2f2-4ac3-8ceb-409df4f2aff0" />


---

## 📊 Dashboard

<img width="1918" height="861" alt="image" src="https://github.com/user-attachments/assets/67adf9b0-4f5b-48a1-9916-402abdbfb59f" />


---

## 📄 Resume Analysis

<img width="1244" height="710" alt="image" src="https://github.com/user-attachments/assets/335014ae-b8e4-4f16-838d-4307f58a9551" />


---

## 🎯 Job Description Matcher

<img width="1891" height="687" alt="image" src="https://github.com/user-attachments/assets/67cf01ee-820a-4241-888c-a76ea1b58abd" />


---

## 📉 Skill Gap Analysis

<img width="585" height="748" alt="image" src="https://github.com/user-attachments/assets/7b8cc6dd-98cb-411c-a23c-da494aa7e52d" />


---

## 🛣️ Learning Roadmap
<img width="1144" height="730" alt="image" src="https://github.com/user-attachments/assets/e0c1fa9c-e49f-4fc9-b0fd-8bc67d338a92" />



---

## 💼 Mock Interview

<img width="1207" height="516" alt="image" src="https://github.com/user-attachments/assets/d0a58778-9015-4e17-89d8-45939d2731cd" />


---

# 🚀 Installation

## Clone the Repository

```bash
git clone https://github.com/srijabala/Capstone-Project.git
```

Move into the project folder

```bash
cd Capstone-Project
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Start the development server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

# 📁 Project Structure

```
src/
│
├── components/
├── pages/
├── hooks/
├── utils/
├── assets/
├── App.jsx
└── main.jsx

public/

README.md

package.json
```

---

# 🎯 Future Enhancements

- Adaptive technical skill assessment
- AI confidence-based career recommendations
- Recruiter simulation dashboard
- Resume version comparison
- LinkedIn profile integration
- PDF career report generation
- Cloud synchronization
- Multi-language resume support

---

# 🔐 Security

- Environment variables managed using `.env`
- API keys excluded from version control using `.gitignore`
- User information stored locally using browser storage
- No sensitive credentials committed to GitHub

---

# 👨‍💻 Developed By

**Venkata Sai Srija Bala Badruni**

Capstone Project • 2026

---

# 📄 License

This project was developed for educational and academic purposes as part of a capstone submission.

© 2026 CareerCompass AI. All Rights Reserved.
