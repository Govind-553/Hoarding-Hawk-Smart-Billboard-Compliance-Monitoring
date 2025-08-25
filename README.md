# 🦅 Hoarding Hawk – Smart Billboard Compliance Monitoring System

**Hoarding Hawk** is a smart, citizen-powered reporting system that helps authorities monitor and manage **billboard compliance** in cities.<br>  
It empowers citizens to capture geotagged billboard images using a **Progressive Web App (PWA)**, where **on-device AI + OCR** instantly detect potential violations (e.g., missing license, placement near junctions).  
Reports are then submitted to a **web dashboard** where officers can review, verify against permit records, and take action.<br>  

Built with **free, open-source tools** and deployed on **Vercel + Render + Supabase**, Hoarding Hawk is cost-effective, scalable, and designed for real-world impact under the **Smart City Mission**.  

---

## 🚀 Features
- 📸 **Citizen PWA App** – Capture geotagged images of billboards.  
- 🤖 **On-Device AI & OCR** – Detect missing permits, placement near junctions/signals.  
- 🗺️ **Geofence Rule Engine** – Turf.js + OpenStreetMap to validate locations.  
- 📂 **Permit Registry Matching** – OCR + location match with registered billboard data.  
- 📊 **Officer Dashboard** – Review reports, send notices, dismiss false cases.  
- 🔐 **Privacy First** – Runs OCR & AI in-browser, minimal data uploaded.  

---

## 🛠️ Technology Stack
- **Frontend (Vercel):** React, TailwindCSS, PWA, MapLibre, Turf.js, TensorFlow.js, Tesseract.js  
- **Backend (Render):** Node.js + Express  
- **Database/Auth/Storage:** Supabase (PostgreSQL)  
- **Maps:** OpenStreetMap + MapLibre (open-source, free)  

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

          git clone https://github.com/Govind-553/Hoarding-Hawk-Smart-Billboard-Compliance-Monitoring.git
          cd Hoarding-Hawk-Smart-Billboard-Compliance-Monitoring

### 2. Frontend Setup

          cd frontend
          npm install
          npm run dev

Runs locally on: http://localhost:8080 

### 3. Backend Setup

          cd backend
          npm install
          npm start

Runs locally on: http://localhost:3000

### 4. Supabase Setup

* Create a Supabase project.

* Get your API keys + project URL from Supabase dashboard.

* Add them in .env file inside backend/:

#### env
          PORT=3000
          SUPABASE_URL=your-project-url
          SUPABASE_KEY=your-anon-key

### 5. Database Schema

- Run the SQL schema file (db/schema.sql) inside Supabase → SQL Editor.

## 🚀 Live Demo

- 🌐 **Frontend (Hosted on Vercel):** [Hoarding-Hawk](https://hoarding-hawk.vercel.app/)

- ⚙️ **Backend (Deployed on Render):** [API_Endpoint](https://hoarding-hawk-api.onrender.com)

## 👨‍💻 Team
**Team QuadCoders** – Atharva College of Engineering

| Name              | Role                                 |
|-------------------|--------------------------------------|
| Govind Choudhari  | Team Lead, Full-Stack Developer      |
| Abhiruchi Kunte   | UI/UX, Backend Developer             |
| Sahil Kale        | UI/UX Designer, AI-ML & Integration  |

--- 

## ✨ Final Note to Judges
“Hoarding Hawk is more than just a hackathon project — it is a practical, scalable, and citizen-driven solution that brings transparency, safety, and innovation to our cities. We’re not just building software; we’re shaping smarter governance.”

