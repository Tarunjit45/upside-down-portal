# 🌌 The Upside Down Portal — Stranger Things AI Poster Generator

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/Vision-Gemini%203%20Pro-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4+-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

**The Upside Down Portal** is an immersive *Stranger Things Season 5* poster generator powered by Google's **Gemini Multimodal Vision API**. Step into Hawkins, Indiana circa 1985: take a selfie or upload a photo, and watch the AI transform your portrait into a cinematic, retro-synthwave movie poster from the Upside Down.

---

## ✨ Features

* 📸 **Retro 1985 Hawkins CRT Interface:** Immersive retro aesthetic with VHS scanlines, vintage synthwave color palettes, and arcade typography.
* 🐙 **Upside Down Transformation:** Gemini Multimodal Vision infuses red lightning, creeping Mind Flayer vines, spore particles, and vintage grain into your photos.
* 🎞️ **Custom Poster Typography:** Generate official Netflix-style promotional posters complete with title logos, tagline generators, and credits billing blocks.
* 📷 **Webcam Ingestion:** Snap photos directly from your browser with integrated camera support.

---

## 🛠️ Tech Stack & Architecture

* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React.
* **AI Engine:** Google Gemini API (`@google/genai`).
* **Tooling:** Vite, PostCSS.

---

## 📁 Repository Structure

```text
upside-down-portal/
├── App.tsx             # Main portal interface, CRT frame & poster studio
├── index.tsx           # React bootstrap entry
├── index.html          # HTML shell with vintage typography imports
├── components/         # Camera capture, poster canvas, retro filter sliders
├── constants.ts        # Retro sound effects, Hawkins lore tags, theme palettes
├── services/           # Gemini API client & multimodal image prompts
├── metadata.json       # App manifest & permissions
├── package.json        # Dependencies & scripts
├── LICENSE             # MIT License
└── README.md
```

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/Tarunjit45/upside-down-portal.git
cd upside-down-portal

npm install
```

### 2. Configure Environment
Create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
