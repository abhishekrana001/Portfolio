# 🚀 Abhishek Rana — Full Stack & Android Developer Portfolio

<div align="center">

![Portfolio Preview](https://img.shields.io/badge/Status-Active%20%26%20Maintained-brightgreen?style=for-the-badge)
![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

A modern, responsive, and production-ready developer portfolio featuring an interactive **Live Portfolio Studio (Admin Dashboard)** to customize and manage every section in real time.

[View Live Portfolio](#-getting-started) • [Admin Studio](#-portfolio-studio-admin-panel) • [API Documentation](#-api-endpoints) • [Deployment Guide](#-deployment-guide)

</div>

---

## 🌟 Key Highlights & Features

### 💻 Client Features (Public Portfolio)
* 🌓 **Adaptive Dark & Light Theme** — Seamless toggle with system preference detection and `localStorage` persistence.
* 📱 **Pixel-Perfect Responsive Design** — Handcrafted CSS architecture optimized for mobile, tablet, and ultra-wide screens.
* 💼 **Dynamic Project Portfolio** — Filterable project gallery with live demo links, GitHub source links, and category sorting.
* ⚡ **Interactive Skills Matrix** — Categorized technical competencies with custom dynamic icon rendering.
* 📬 **Contact & Collaboration Section** — 1-click email copy, direct mailto launcher, and social profiles.
* 📄 **Resume / CV Management** — Quick-access PDF download and viewer.

### 🛡️ Portfolio Studio (Admin Dashboard at `/admin`)
* 🔐 **Secure PIN-Protected Authentication** — Built-in session security with customizable master PIN.
* ✍️ **Complete Section Management**:
  * **Hero & Bio Editor** — Update status tags, greetings, titles, descriptions, and CTA buttons.
  * **About Me Editor** — Edit paragraphs, bullet highlights, and credential cards.
  * **Technical Skills Editor** — Add/remove categories, modify skill tags, and customize icons.
  * **Projects Portfolio Studio** — Create new projects, upload screenshots, reorder cards, and manage tags.
  * **Contact & Socials Editor** — Update email addresses, handles, and response commitments.
  * **Footer & Branding Editor** — Custom brand names, taglines, and copyright notices.
  * **Security & Backup Studio** — Change admin PIN, download complete JSON backup, and import state.
* 📂 **Multer File Upload System** — Upload screenshots and CV documents directly through the admin panel.
* 🔄 **Resilient Data Layer** — Works with automated JSON persistence (`portfolioData.json`) and optional MongoDB sync.

---

## 🛠️ Technology Stack

| Layer | Technologies & Tools |
| :--- | :--- |
| **Frontend** | React 19, JavaScript (ESNext), Lucide React, HTML5, Vanilla CSS3 (Custom Design System) |
| **Build Tooling** | Vite 8, Rolldown Babel Plugin, ESLint 10 (Flat Config) |
| **Backend** | Node.js, Express.js 5, Multer (File Uploads), CORS, Dotenv |
| **Database** | MongoDB (Mongoose 9) with automatic local JSON fallback (`server/data/portfolioData.json`) |
| **Core Competencies** | Java, Spring Boot, REST APIs, MySQL, Kotlin (Native Android), MERN Stack |

---

## 📁 Project Architecture

```text
Portfolio/
├── server/                        # Express Backend
│   ├── config/
│   │   └── db.js                  # Resilient MongoDB Connection Handler
│   ├── data/
│   │   └── portfolioData.json     # Primary JSON Datastore (Zero-Config DB)
│   ├── middleware/
│   │   ├── auth.js                # Admin PIN Authentication Middleware
│   │   └── upload.js              # Multer File Upload Handler (Images & PDFs)
│   ├── models/                    # Mongoose Schemas (Project, Skill, Message)
│   ├── routes/                    # Express API Routers
│   ├── uploads/                   # Uploaded project images & documents
│   └── server.js                  # Unified Express Application Server
│
├── src/                           # React Frontend
│   ├── assets/                    # Static images, icons, and default CV
│   ├── Components/
│   │   ├── Admin/                 # Portfolio Studio Components
│   │   │   ├── AdminDashboard.jsx # Studio Tabbed Workspace
│   │   │   ├── AdminLogin.jsx     # Glassmorphism PIN Authentication Gate
│   │   │   ├── HeroEditor.jsx     # Hero Section Editor
│   │   │   ├── AboutEditor.jsx    # About Section Editor
│   │   │   ├── SkillsEditor.jsx   # Skills Category Editor
│   │   │   ├── ProjectsEditor.jsx # Full-Featured Projects Manager
│   │   │   ├── ContactEditor.jsx  # Contact & Socials Editor
│   │   │   ├── FooterEditor.jsx   # Footer Editor
│   │   │   └── SettingsEditor.jsx # PIN Update & JSON Backup Utility
│   │   ├── About.jsx              # About Me Section
│   │   ├── AdminLauncher.jsx      # Floating Admin Gear/Dashboard Shortcut
│   │   ├── Contact.jsx            # Get in Touch Section
│   │   ├── Footer.jsx             # Site Footer
│   │   ├── Home.jsx               # Hero Introduction
│   │   ├── Navbar.jsx             # Sticky Navigation Bar with Theme Switcher
│   │   ├── Projects.jsx           # Filterable Project Cards Grid
│   │   └── Skills.jsx             # Technical Skills Grid
│   ├── context/
│   │   └── PortfolioContext.jsx   # Central Data Context & Live Sync State
│   ├── data/
│   │   ├── assetRegistry.js       # Dynamic Icon & Asset Resolver
│   │   └── defaultPortfolioData.js# Factory Default Portfolio Dataset
│   ├── services/
│   │   └── api.js                 # Unified Client API Service
│   ├── App.jsx                    # Route Registry
│   ├── index.css                  # Global Styles & CSS Design Tokens
│   └── main.jsx                   # React 19 Entrypoint
│
├── .env.example                   # Environment Variables Reference
├── eslint.config.js               # Multi-Environment ESLint Configuration
├── index.html                     # HTML Template & SEO Meta Tags
├── package.json                   # Project Dependencies & Scripts
└── vite.config.js                 # Vite & Proxy Configuration
```

---

## 🚀 Getting Started

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* *(Optional)* **MongoDB**: Local MongoDB community service or MongoDB Atlas connection URI

---

### 2. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/abhishekrana001/Portfolio.git
   cd Portfolio
   ```

2. **Install all dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *(On Windows PowerShell: `Copy-Item .env.example .env`)*

   Default variables:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/portfolio
   ADMIN_PIN=1234
   NODE_ENV=development
   ```

---

### 3. Running Locally

You can run both client and server simultaneously using:

```bash
npm run dev
```

Or run them individually in separate terminals:

```bash
# Terminal 1: Start Express Backend (Port 5000)
npm run server

# Terminal 2: Start Vite Client (Port 5173)
npm run client
```

* **Client Portfolio**: [http://localhost:5173](http://localhost:5173)
* **Backend API**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
* **Admin Studio**: [http://localhost:5173/admin](http://localhost:5173/admin) *(Default PIN: `1234`)*

---

### 4. Available NPM Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs both Vite dev server and Express backend concurrently. |
| `npm run client` | Starts Vite development server with Hot Module Replacement (HMR). |
| `npm run server` | Starts Express backend server with Node.js. |
| `npm run build` | Compiles production assets into `dist/`. |
| `npm run preview` | Locally serves production build for testing. |
| `npm run lint` | Runs ESLint to check for code issues (0 errors, 0 warnings). |

---

## 📡 API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Healthcheck endpoint returning server status. |
| `GET` | `/api/portfolio` | Fetches complete portfolio dataset for all sections. |
| `GET` | `/api/projects` | Fetches project list from MongoDB collection. |
| `GET` | `/api/skills` | Fetches technical skills grouped by category. |
| `POST` | `/api/messages` | Submits a contact inquiry message. |

### Admin Endpoints (Protected)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/verify` | Validates security PIN and issues session token. |
| `POST` | `/api/admin/login` | Validates security PIN for standalone admin queries. |
| `PUT` | `/api/portfolio` | Saves updated portfolio JSON dataset. |
| `PUT` | `/api/portfolio/:section` | Updates a specific section (e.g. `home`, `projects`). |
| `PUT` | `/api/auth/update-pin` | Updates the master security PIN. |
| `POST` | `/api/upload` | Uploads project images or CV PDFs via Multer (`max: 20MB`). |

---

## 🌐 Deployment Guide

### Option 1: Frontend on Vercel + Backend on Render (Recommended)

#### 1. Deploy Database (MongoDB Atlas)
1. Create a free M0 cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Set Network Access IP to `0.0.0.0/0`.
3. Copy your database connection URI (`mongodb+srv://...`).

#### 2. Deploy Backend on Render ([render.com](https://render.com))
1. Create a **New Web Service** connected to your GitHub repo.
2. Settings:
   - **Build Command**: `npm install`
   - **Start Command**: `node server/server.js`
3. Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `ADMIN_PIN`: *(your secret PIN)*
   - `MONGO_URI`: *(your MongoDB Atlas URI)*
4. Copy your live Render URL (e.g. `https://portfolio-backend-xxx.onrender.com`).

#### 3. Deploy Frontend on Vercel ([vercel.com](https://vercel.com))
1. Import the repository into Vercel.
2. Build Settings:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Environment Variables:
   - `VITE_API_URL`: `https://portfolio-backend-xxx.onrender.com/api`

---

## 👤 Author

**Abhishek Rana**  
*Java Full Stack & Android Developer*

* 📧 **Email:** [abhishekrana99813@gmail.com](mailto:abhishekrana99813@gmail.com)
* 💼 **LinkedIn:** [linkedin.com/in/abhishekrana99813](https://linkedin.com/in/abhishekrana99813)
* 🐙 **GitHub:** [@abhishekrana001](https://github.com/abhishekrana001)

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use and adapt it for your own portfolio.
