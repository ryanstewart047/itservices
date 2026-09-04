# EARPI - Earth Regenerative Projects International

Modern Next.js 15 Web Application & Progressive Web App (PWA) for **Earth Regenerative Projects International (EARPI)** (`https://earpi.org`).

Registered USA Non-profit Corporation MA 001751059 • EIN: 99-0979318 • Freetown, Sierra Leone.

---

## 🌟 Key Features

- **Modern Architecture**: Next.js 15 App Router, TypeScript, React 19, modular components.
- **Installable PWA**:
  - Web App Manifest (`/manifest.json`)
  - Offline Service Worker (`/sw.js`) with cache-first and network-first strategies
  - Mobile Install Prompt (`PWAInstallPrompt.tsx`) with native-like Android install banner and iOS Safari "Add to Home Screen" instructions.
  - High-resolution PWA icons (192x192, 512x512, maskable).
- **AI Climate Assistant Chatbot**:
  - Replaces legacy static chat with an embedded EARPI AI Assistant (`components/ai/AIChatBot.tsx`).
  - Powered by `/api/chat` with deep organizational knowledge (mission, projects, team, donation channels).
  - Out-of-the-box knowledge base with optional Gemini/OpenAI API key integration.
- **Modern Newsletter Popup**:
  - Replaces legacy static popup with an interactive modal with instant AJAX feedback and 7-day dismissal persistence.
- **Gmail SMTP Auto-Notification System**:
  - Automated confirmation emails to subscribers and donors.
  - Real-time notification alerts sent to `official@earpi.org`.
  - Configured via environment variables (`GMAIL_USER`, `GMAIL_APP_PASSWORD`).
- **Full SEO & Clean Routing**:
  - 37 migrated pages with custom metadata.
  - Permanent 301 redirects from all legacy `.html` URLs (`/about.html` → `/about`) to preserve SEO authority.
  - Backward-compatible rewrites for legacy PHP endpoints (`/subscribe.php`, `/contact.php`).
- **Optimized for Vercel**:
  - `vercel.json` with security headers, clean URLs, and long-term asset caching.
  - Zero-configuration deployment for `earpi.org`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your Gmail SMTP credentials:
```ini
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-character-app-password
ADMIN_EMAIL=official@earpi.org

# Optional: External AI APIs
GEMINI_API_KEY=
OPENAI_API_KEY=
```

> **How to get a Gmail App Password**:
> 1. Go to your [Google Account Security](https://myaccount.google.com/security).
> 2. Ensure 2-Step Verification is turned ON.
> 3. Under "2-Step Verification", select "App passwords".
> 4. Generate a new app password named "EARPI Website" and paste the 16 characters into `GMAIL_APP_PASSWORD`.

### 3. Run Locally in Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## ☁️ Deploying to Vercel with Custom Domain `earpi.org`

1. **Push to GitHub**: Code is maintained on the `main` branch.
2. **Import into Vercel**:
   - Log into [Vercel](https://vercel.com).
   - Click **Add New...** → **Project**.
   - Select your GitHub repository `ryanstewart047/earpi`.
   - Vercel automatically detects Next.js.
3. **Set Environment Variables on Vercel**:
   - In the project settings, add:
     - `GMAIL_USER`: your Gmail address
     - `GMAIL_APP_PASSWORD`: your 16-character App Password
     - `ADMIN_EMAIL`: `official@earpi.org`
     - (Optional) `GEMINI_API_KEY` or `OPENAI_API_KEY`
4. **Connect Custom Domain `earpi.org`**:
   - Go to **Project Settings** → **Domains**.
   - Enter `earpi.org` and `www.earpi.org`.
   - Follow Vercel's DNS instructions (add A record pointing to `76.76.21.21` and CNAME `cname.vercel-dns.com`).
5. **Deploy**: Vercel will build and deploy the Next.js application globally with automatic SSL.

---

## 📱 PWA Features

- **Android / Chrome / Edge**: Automatically detects browser support and triggers an interactive install prompt banner prompting the user to install EARPI as a native app.
- **iOS / Safari**: Shows an instruction prompt guiding users to tap the **Share** button and choose **"Add to Home Screen"**.
- **Offline Support**: Caches core stylesheets, scripts, and logos for offline access.
