<div align="center">

# Muskan Zahid Ali Khaskheli
### Frontend Developer Portfolio

A responsive, data-driven personal portfolio built entirely with vanilla HTML, CSS, and JavaScript.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-264DE4?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![No Framework](https://img.shields.io/badge/Framework-None-lightgrey?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success?style=flat-square)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Accessibility](#accessibility)
- [Design Decisions](#design-decisions)
- [Roadmap](#roadmap)
- [Author](#author)

---

## Overview

This repository contains a fully responsive, theme-aware personal portfolio site. Every section — Hero, About, Skills, Projects, Services, Blog, Testimonials, and Contact — is rendered from either static markup or a small set of JSON resources through a centralized API service layer, so most content updates only require editing data, not code.

The project was built as part of **Codiora House (Private) Limited's** Frontend Development track, Week 8 milestone: *Final Project — Professional Portfolio Website*.

## Architecture

The codebase follows a clear separation of concerns:

```
Presentation (HTML/CSS)  →  UI Logic (script.js)  →  Data Access (services/api.js)  →  Data (JSON)
```

- **`services/api.js`** is the single point of contact with data. Every network request in the project flows through one internal `fetchResource()` helper, which normalizes errors and guarantees callers always receive either resolved data or a rejected `Error` — never a raw fetch failure.
- **`script.js`** never calls `fetch()` directly. It imports typed accessor functions (`getProfile`, `getSkills`, `getProjects`, `getContact`, `getBlogPosts`) and is responsible only for rendering and interaction.
- **`data/*.json`** acts as a lightweight mock API, making the frontend trivially portable to a real backend later — swapping `services/api.js` internals is the only change required.

This structure keeps UI code and data concerns independent, testable, and easy to reason about.

## Key Features

**Experience & Interaction**
- Dark / light theme toggle with persisted user preference and system-preference detection
- Animated typewriter effect cycling through role titles
- Scroll-triggered reveal animations via `IntersectionObserver`
- Animated statistic counters and skill progress bars

**Content & Data**
- Data-driven sections (About, Skills, Projects, Blog, Contact) sourced from JSON, with a static Services section
- Graceful fallback to static content if a data fetch fails, so the page never breaks
- Loading skeletons, empty states, and retry-capable error states for the projects grid

**Services & Projects & Blog**
- A Services section highlighting core offerings (Frontend Development, Responsive Web Design, UI/UX Design, Website Maintenance)
- Live search across project name, technology, and description
- Category-based filtering with smooth transition states
- Project detail modal with an image gallery, tech stack, and external links
- Blog article modal with full content, metadata, and tags

**Forms & Feedback**
- Contact form with real-time client-side validation and clear success/error feedback

**Engineering Quality**
- Zero external JS frameworks or build tooling — runs natively in any modern browser
- Clean, comment-free production code with consistent formatting
- Semantic, accessible markup throughout

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3 — Flexbox, Grid, custom properties, keyframe animations |
| Behavior | Vanilla JavaScript (ES Modules, `async`/`await`, Fetch API) |
| Typography | Google Fonts — Poppins, Outfit, Space Grotesk |
| Data Layer | Static JSON, consumed through a Promise-based service module |
| Tooling | None required — no bundler, no package manager dependency |

## Project Structure

```
.
├── index.html                 # Document structure, Services section & static fallback content
├── style.css                  # Design system, layout, animations, theming
├── script.js                  # Rendering, interactivity, state management
├── services/
│   └── api.js                 # Centralized data-access layer
├── data/
│   ├── profile.json           # Hero & About content
│   ├── skills.json            # Skills section data
│   ├── projects.json          # Projects grid & modal data
│   ├── contact.json           # Contact details
│   └── blog.json              # Blog posts & article modal data
├── blog_1.png
├── blog_2.png
├── blog_3.jpg                 # Blog thumbnail assets
└── README.md
```

## Getting Started

The site loads its content via the Fetch API, which browsers restrict under the `file://` protocol. It must be served over HTTP.

**1. Clone the project**
```bash
git clone <repository-url>
cd <project-directory>
```

**2. Serve it locally** — any static server works:

```bash
# Python
python3 -m http.server 8000

# Node
npx serve .
```

Or, in VS Code: right-click `index.html` → **Open with Live Server**.

**3. Open in your browser**
```
http://localhost:8000
```

No build step, no dependency installation, no configuration required.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`) with descriptive ARIA labels
- Keyboard-operable navigation, filters, and modal dialogs
- Sufficient color contrast maintained across both themes
- All images include descriptive `alt` text and use `loading="lazy"`

## Design Decisions

- **Data-driven over hardcoded**: content changes (new project, new blog post) require only a JSON edit, not a markup or deploy change.
- **Fail-soft data layer**: if a JSON resource can't load, the UI falls back to sensible static content instead of showing a broken page.
- **No framework, by choice**: the scope didn't warrant one — vanilla JS keeps the bundle size at zero and the codebase approachable.

## Roadmap

- [ ] Connect the data layer to a real backend/CMS
- [ ] Add automated accessibility and Lighthouse CI checks
- [ ] Add unit tests for the API service layer
- [ ] Progressive image loading with responsive `srcset`

## Author

**Muskan Zahid Ali Khaskheli**
Frontend Developer · BSIT Student, SAU Tandojam

---

<div align="center">

Built with clean code and attention to detail.

</div>
