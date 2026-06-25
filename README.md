# ReviveEd v2 🛡️
**AI that tells teachers why students are failing, before it's too late.**
 
Most students who fall behind don't know why. Their teachers don't have the bandwidth to find out, and parents often discover it too late. ReviveEd v2 closes that gap.
  
---
 
## The Problem
 
In large Indian classrooms, teachers cannot individually track why each student is underperforming. A student may fail the same concept — Fractions, Grammar, Chemical Equations — multiple times without anyone identifying the pattern. By the time it surfaces, the gap is already deep.
 
---
 
## What It Does
 
| Role | Experience |
|---|---|
| 🎓 **Student** | Take quizzes, ask doubts in plain language, track progress with a visual Learning Shield |
| 🛡️ **Teacher** | See which students are slipping, get AI diagnosis explaining *why*, send parent nudges in one click |
| 👨‍👩‍👧 **Parent** | Receive specific notifications with real context — not generic alerts |
 
---
 
## Demo Credentials
 
| Role | Username | Password |
|---|---|---|
| Student | Arjun | 8 |
| Teacher | Teacher01 | teach01 |
| Parent | Parent01 | par01 |
 
---
 
## How the AI Works
 
Three Supabase Edge Functions handle all AI inference — the frontend never calls the model directly:
 
- **`get-ai-insight`** — Analyzes a student's attempt history, returns structured JSON: root cause, urgency, confidence, recommended action
- **`get-doubt-answer`** — Answers student questions tuned to their grade level and subject
- **`send-nudge`** — Generates a parent-facing message with specific context from the teacher's diagnosis
Every AI call is built from real student data — attempt history, engagement trend, streak, wrong topics. No generic responses.
 
---
 
## Tech Stack
 
| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Pure CSS with CSS Variables |
| Backend | Supabase (PostgreSQL + Edge Functions) |
| AI | Nvidia Llama-3.1 Nemotron 70B via edge functions|
| Deployment | Vercel (frontend) + Supabase (backend) |
 
---
 
## Features
 
**Student**
- Adaptive 5-level quiz system per class (unlocks on 60%+ score)
- Learning Shield — visual progress tracker based on real quiz accuracy
- Doubt Room — ask anything from your syllabus, get curriculum-aware answers
- Study Groups, Activity Heatmap, Board Exam Prep mode
  
**Teacher**
- Engagement Heatmap — 6-day colour-coded grid per student
- AI Insight — root cause analysis with explainability panel
- One-click parent nudge
- Risk classification — Critical / Warning / Safe
  
**Parent**
- Learning Shield view for their child
- AI-generated teacher notifications
- Two-way messaging with teacher
---
 
## Project Structure
 
```
src/
├── components/
│   ├── Student/       # Dashboard, QuizEngine, DoubtRoom, StudyGroup
│   ├── Teacher/       # Dashboard, HeatmapGrid, AlertPanel, NudgeButton
│   └── Parent/        # Dashboard, NotificationCard, MessageTeacher
├── lib/
│   ├── ai.js          # AI client with fallbacks and timeout handling
│   ├── db.js          # All Supabase queries
│   ├── prompts.js     # All AI prompts — centralised
│   └── supabase.js    # DB client
supabase/
└── functions/
    ├── get-ai-insight/
    ├── get-doubt-answer/
    └── send-nudge/
```
