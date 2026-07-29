import { getProfile, getSkills, getProjects, getContact, getBlogPosts } from "./services/api.js";

(function initThemeSystem() {
  const themeToggle = document.getElementById("themeToggle");
  if (!themeToggle) return;
  const THEME_KEY = "portfolio-theme";
  const html = document.documentElement;
  function getSavedTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }
  const initialTheme = getSavedTheme();
  applyTheme(initialTheme);
  themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", e => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });
})();

(function initTypewriter() {
  const el = document.getElementById("typedText");
  if (!el) return;
  const FALLBACK_ROLES = [ "Frontend Developer", "Web Developer", "HTML CSS Developer", "UI Designer" ];
  function roles() {
    return window.__PROFILE_ROLES__ && window.__PROFILE_ROLES__.length ? window.__PROFILE_ROLES__ : FALLBACK_ROLES;
  }
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;
  function type() {
    const current = roles()[roleIndex];
    if (deleting) {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles().length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 50);
    } else {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 75);
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(type, 300));
  } else {
    setTimeout(type, 300);
  }
})();

(function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  if (!navbar) return;
  const mobileMenu = document.createElement("div");
  mobileMenu.className = "navbar__mobile-menu";
  mobileMenu.id = "mobileMenu";
  const links = [ "Home:#home", "About:#about", "Skills:#skills", "Projects:#projects", "Testimonials:#testimonials", "Contact:#contact" ];
  links.forEach(item => {
    const [label, href] = item.split(":");
    const a = document.createElement("a");
    a.href = href;
    a.className = "navbar__mobile-link";
    a.textContent = label;
    mobileMenu.appendChild(a);
  });
  document.body.appendChild(mobileMenu);
  function updateActiveLink() {
    const sections = document.querySelectorAll("section[id]");
    let current = "";
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 150) {
        current = sec.id;
      }
    });
    document.querySelectorAll(".navbar__link, .navbar__mobile-link").forEach(link => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }
  let scrollTimeout;
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 30);
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateActiveLink, 50);
  }, {
    passive: true
  });
  if (hamburger) {
    hamburger.addEventListener("click", e => {
      e.stopPropagation();
      const isOpen = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
    });
  }
  mobileMenu.addEventListener("click", e => {
    if (e.target.classList.contains("navbar__mobile-link")) {
      mobileMenu.classList.remove("open");
      if (hamburger) {
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    }
  });
  document.addEventListener("click", e => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove("open");
      if (hamburger) {
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    }
  });
  updateActiveLink();
})();

(function initSmoothScroll() {
  document.addEventListener("click", e => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 90;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: top,
        behavior: "smooth"
      });
    }
  });
})();

(function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: .1,
    rootMargin: "0px 0px -50px 0px"
  });
  items.forEach(el => observer.observe(el));
})();

(function initCounters() {
  const stats = document.querySelectorAll(".about__stat-num[data-target]");
  if (!stats.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      observer.unobserve(el);
      const duration = 1500;
      const start = Date.now();
      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(target * progress);
        el.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          el.textContent = target;
        }
      };
      animate();
    });
  }, {
    threshold: .5
  });
  stats.forEach(el => observer.observe(el));
})();

(function initSkillBars() {
  const bars = document.querySelectorAll(".skill-bar-fill");
  if (!bars.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const width = fill.dataset.width;
        fill.style.width = width + "%";
        observer.unobserve(fill);
      }
    });
  }, {
    threshold: .3
  });
  bars.forEach(bar => observer.observe(bar));
})();

(function initContactForm() {
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  const btn = document.getElementById("submitBtn");
  if (!form) return;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const required = form.querySelectorAll("[required]");
    let isValid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = "#ef4444";
        isValid = false;
        field.addEventListener("input", () => {
          field.style.borderColor = "";
        }, {
          once: true
        });
      }
    });
    if (!isValid) return;
    const originalHTML = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px;animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10"/><path d="M12 2v8M12 14v8"/></svg> Sending...';
    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      form.reset();
      if (success) {
        success.classList.add("show");
        setTimeout(() => {
          success.classList.remove("show");
        }, 4e3);
      }
    }, 1200);
  });
})();

const style = document.createElement("style");

style.textContent = `\n  @keyframes spin {\n    to { transform: rotate(360deg); }\n  }\n`;

document.head.appendChild(style);

document.addEventListener("DOMContentLoaded", () => {
  console.log("Portfolio loaded successfully!");
});

const WEEK3_PROJECT_DATA = {
  1: {
    title: "Tech Journey Website",
    category: "Web Development",
    desc: "An interactive website documenting a developer's learning journey with timelines and milestones. Built to showcase growth over time with smooth scroll-based storytelling.",
    tech: [ "HTML", "CSS", "JavaScript" ],
    github: "https://github.com/muskankhaskheli240-coder/Decodlab_Firstproject.git",
    demo: "https://muskankhaskheli240-coder.github.io/Decodlab_Firstproject/"
  },
  2: {
    title: "Beautiful Gift Box Website",
    category: "Other",
    desc: "Animated CSS gift unboxing experience with elegant reveal effects and delightful micro-interactions. A playful exploration of pure-CSS animation techniques.",
    tech: [ "HTML", "CSS", "Animations" ],
    github: "https://github.com/muskankhaskheli240-coder/Decodlabs_SecondProject.git",
    demo: "https://muskankhaskheli240-coder.github.io/Decodlabs_SecondProject/"
  },
  3: {
    title: "MoodSphere",
    category: "UI/UX Design",
    desc: "Mood-based room ambience app where colors and atmosphere transform dynamically based on emotion. Focused on calming transitions and intuitive mood selection.",
    tech: [ "HTML", "CSS", "JavaScript" ],
    github: "https://github.com/muskankhaskheli240-coder/Decodlabs_ThirdProject.git",
    demo: "https://muskankhaskheli240-coder.github.io/Decodlabs_ThirdProject/"
  },
  4: {
    title: "Smart Form Pro AI",
    category: "Web Development",
    desc: "Intelligent form builder with smart validation, auto-suggestions, and seamless user experience. Combines real-time feedback with a clean, distraction-free interface.",
    tech: [ "HTML", "CSS", "AI", "JavaScript" ],
    github: "https://github.com/muskankhaskheli240-coder/Decodlabs_FourthProject.git",
    demo: "https://muskankhaskheli240-coder.github.io/Decodlabs_FourthProject/"
  },
  5: {
    title: "First Portfolio Website",
    category: "Web Development",
    desc: "My very first personal portfolio — the milestone that started this entire journey into frontend development.",
    tech: [ "HTML", "CSS", "JavaScript" ],
    github: "https://github.com/muskankhaskheli240-coder/Muskan-s-Portfolio.git",
    demo: "https://muskankhaskheli240-coder.github.io/Muskan-s-Portfolio/"
  },
  6: {
    title: "Neumorphic Animated Form",
    category: "UI/UX Design",
    desc: "Soft-UI neumorphic form with smooth animations, tactile depth, and elegant interactive feedback. A study in subtle shadows and modern form design.",
    tech: [ "HTML", "CSS", "Neumorphism" ],
    github: "https://github.com/muskankhaskheli240-coder/Practice_Matarail_of_frontend.git",
    demo: "https://github.com/muskankhaskheli240-coder/Practice_Matarail_of_frontend.git"
  }
};

const WEEK3_ARTICLE_DATA = {
  1: {
    title: "Modern CSS Techniques Every Frontend Developer Should Know",
    image: "blog_1.png",
    date: "June 10, 2026",
    readTime: "6 min read",
    content: "CSS has evolved far beyond simple styling. Container queries let components respond to their own container rather than the viewport, making truly modular layouts possible. The :has() selector brings parent-aware styling without JavaScript. CSS Grid subgrid, scroll-driven animations, and native nesting all reduce the need for preprocessors. Staying current with these features means writing less code that does more, while keeping stylesheets easier to maintain as a project grows.",
    tags: [ "CSS", "Frontend", "Web Design" ]
  },
  2: {
    title: "JavaScript Best Practices for Clean Code",
    image: "blog_2.png",
    date: "June 2, 2026",
    readTime: "5 min read",
    content: "Clean JavaScript starts with naming things clearly and keeping functions small enough to understand at a glance. Favor pure functions where possible, avoid deeply nested conditionals, and let early returns simplify control flow. Consistent formatting and meaningful comments matter less than structure — code that is organized into small, single-purpose pieces is easier to test, debug, and hand off to someone else. Treat refactoring as a normal part of writing code, not an afterthought.",
    tags: [ "JavaScript", "Clean Code", "Best Practices" ]
  },
  3: {
    title: "Why Responsive Design Matters",
    image: "blog_3.jpg",
    date: "May 22, 2026",
    readTime: "4 min read",
    content: "More people browse the web on phones than on desktops, which makes responsive design a baseline expectation rather than a bonus feature. A mobile-first approach forces simpler, more focused layouts that scale up gracefully instead of being crammed down. Flexible grids, relative units, and thoughtful breakpoints keep a site usable across an enormous range of screen sizes, and that consistency directly affects how trustworthy and professional a site feels to visitors.",
    tags: [ "Responsive Design", "UX", "Mobile-First" ]
  }
};

const ABOUT_ICONS = {
  education: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M22 10v6M2 10l10-9 10 9M5 8v10a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V8" /></svg>',
  goal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>',
  interests: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>'
};

(function initDynamicProfile() {
  const heroLine1 = document.querySelector(".hero__name-line1");
  const heroLine2 = document.querySelector(".hero__name-line2");
  const heroBio = document.querySelector(".hero__bio");
  const heroBadges = document.querySelectorAll(".hero__badge");
  const blobInitials = document.querySelector(".hero__blob-initials");
  const aboutBioParas = document.querySelectorAll(".about__bio");
  const aboutInfoCards = document.querySelectorAll(".about__info-card");
  const aboutStats = document.querySelectorAll(".about__stat-num[data-target]");
  if (!heroLine1 && !aboutBioParas.length) return;
  getProfile().then(profile => {
    if (Array.isArray(profile.roles) && profile.roles.length) {
      window.__PROFILE_ROLES__ = profile.roles;
    }
    if (heroLine1 && profile.name) heroLine1.textContent = profile.name.line1;
    if (heroLine2 && profile.name) heroLine2.textContent = profile.name.line2;
    if (heroBio && profile.bio) heroBio.textContent = profile.bio;
    if (blobInitials && profile.name) blobInitials.textContent = profile.name.initials;
    if (heroBadges.length && Array.isArray(profile.heroBadges)) {
      heroBadges.forEach((badgeEl, i) => {
        if (profile.heroBadges[i] !== undefined) {
          badgeEl.textContent = profile.heroBadges[i];
        }
      });
    }
    if (profile.about) {
      if (aboutBioParas.length && Array.isArray(profile.about.bioParagraphs)) {
        aboutBioParas.forEach((p, i) => {
          if (profile.about.bioParagraphs[i] !== undefined) {
            p.textContent = profile.about.bioParagraphs[i];
          }
        });
      }
      if (aboutInfoCards.length && Array.isArray(profile.about.infoCards)) {
        aboutInfoCards.forEach((cardEl, i) => {
          const cardData = profile.about.infoCards[i];
          if (!cardData) return;
          const iconWrap = cardEl.querySelector(".about__info-icon");
          const labelEl = cardEl.querySelector(".about__info-label");
          const valueEl = cardEl.querySelector(".about__info-value");
          if (iconWrap && ABOUT_ICONS[cardData.icon]) {
            iconWrap.innerHTML = ABOUT_ICONS[cardData.icon];
          }
          if (labelEl) labelEl.textContent = cardData.label;
          if (valueEl) valueEl.textContent = cardData.value;
        });
      }
      if (aboutStats.length && Array.isArray(profile.about.stats)) {
        aboutStats.forEach(statEl => {
          const statData = profile.about.stats.find(s => s.id === statEl.id);
          if (!statData) return;
          statEl.dataset.target = String(statData.target);
          const labelEl = statEl.closest(".about__stat")?.querySelector(".about__stat-label");
          if (labelEl) labelEl.textContent = statData.label;
        });
      }
    }
  }).catch(err => {
    console.warn("Could not load profile data, showing static content instead:", err.message);
  });
})();

const SKILL_ICONS = {
  html5: '<svg viewBox="0 0 24 24" fill="{{COLOR}}" aria-hidden="true"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" /></svg>',
  css3: '<svg viewBox="0 0 24 24" fill="{{COLOR}}" aria-hidden="true"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531l-.232-2.618 10.059.003-.168-2.965z" /></svg>',
  javascript: '<svg viewBox="0 0 24 24" fill="{{COLOR}}" aria-hidden="true"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" /></svg>',
  responsive: '<svg viewBox="0 0 24 24" fill="none" stroke="{{COLOR}}" stroke-width="1.8" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>',
  git: '<svg viewBox="0 0 24 24" fill="{{COLOR}}" aria-hidden="true"><path d="M23.546 10.93L13.067.452a1.55 1.55 0 00-2.188 0L8.708 2.627l2.76 2.76a1.838 1.838 0 012.327 2.341l2.658 2.66a1.838 1.838 0 011.9 2.9 1.846 1.846 0 01-2.41.26l-2.55-2.55v6.697a1.846 1.846 0 11-2.13-1.82V9.61a1.845 1.845 0 01-.998-2.424L7.51 4.39 .452 11.45a1.55 1.55 0 000 2.188l10.48 10.477a1.55 1.55 0 002.186 0l10.428-10.428a1.55 1.55 0 000-2.187" /></svg>',
  uiux: '<svg viewBox="0 0 24 24" fill="none" stroke="{{COLOR}}" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" /></svg>'
};

(function initDynamicSkills() {
  const skillCards = document.querySelectorAll(".skill-card");
  if (!skillCards.length) return;
  getSkills().then(skills => {
    skillCards.forEach((cardEl, i) => {
      const skill = skills[i];
      if (!skill) return;
      const iconWrap = cardEl.querySelector(".skill-card__icon-wrap");
      const nameEl = cardEl.querySelector(".skill-card__name");
      const pctEl = cardEl.querySelector(".skill-card__pct");
      const descEl = cardEl.querySelector(".skill-card__desc");
      const barFillEl = cardEl.querySelector(".skill-bar-fill");
      if (iconWrap) {
        iconWrap.style.setProperty("--ic", skill.iconColor);
        const template = SKILL_ICONS[skill.icon];
        if (template) {
          iconWrap.innerHTML = template.split("{{COLOR}}").join(skill.iconColor);
        }
      }
      if (nameEl) nameEl.textContent = skill.name;
      if (pctEl) pctEl.textContent = skill.percentage + "%";
      if (descEl) descEl.textContent = skill.description;
      if (barFillEl) {
        barFillEl.dataset.width = String(skill.percentage);
      }
    });
  }).catch(err => {
    console.warn("Could not load skills data, showing static content instead:", err.message);
  });
})();

const PROJECT_ICONS = {
  "browser-lines": '<rect x="4" y="8" width="40" height="32" rx="3" /><path d="M14 20h20M14 26h12" />',
  "gift-box": '<rect x="14" y="10" width="20" height="28" rx="3" /><path d="M20 10V7a2 2 0 014 0v3M18 38l6 4 6-4" />',
  "clock-circle": '<circle cx="24" cy="24" r="16" /><path d="M24 8v16l10 8" />',
  "form-lines": '<rect x="6" y="10" width="36" height="28" rx="3" /><path d="M6 18h36M14 26h8M14 32h16" />',
  star: '<path d="M24 6l4 8 9 1.3-6.5 6.3 1.5 9L24 26l-8 4.6 1.5-9L11 15.3 20 14z" />',
  "rounded-card": '<rect x="8" y="12" width="32" height="24" rx="6" /><path d="M16 22h16M16 28h10" />'
};

const PROJECT_ACTION_ICON_GITHUB = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>';

const PROJECT_ACTION_ICON_DEMO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" /></svg>';

function buildProjectCard(project) {
  const article = document.createElement("article");
  article.className = "project-card glass-card reveal visible";
  article.dataset.category = project.category;
  article.dataset.project = String(project.id);
  article.tabIndex = 0;
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", "View details: " + project.title);
  const tagsHtml = project.technologies.map(t => '<span class="tag">' + escapeHtml(t) + "</span>").join("");
  article.innerHTML = `\n    <div class="project-card__img" style="--pg:${project.gradient}">\n      <svg class="project-card__icon" viewBox="0 0 48 48" fill="none" stroke="${project.iconColor}" stroke-width="1.5" aria-hidden="true">\n        ${PROJECT_ICONS[project.icon] || ""}\n      </svg>\n      <div class="project-card__overlay">\n        <a href="${project.github}" class="project-card__action" aria-label="GitHub" target="_blank" rel="noopener noreferrer">${PROJECT_ACTION_ICON_GITHUB}</a>\n        <a href="${project.demo}" class="project-card__action" aria-label="Live Demo" target="_blank" rel="noopener noreferrer">${PROJECT_ACTION_ICON_DEMO}</a>\n      </div>\n    </div>\n    <div class="project-card__body">\n      <div class="project-card__tags">${tagsHtml}</div>\n      <h3 class="project-card__title">${escapeHtml(project.title)}</h3>\n      <p class="project-card__desc">${escapeHtml(project.description)}</p>\n    </div>\n  `;
  return article;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function buildSkeletonCard() {
  const div = document.createElement("div");
  div.className = "project-card glass-card skeleton-card";
  div.setAttribute("aria-hidden", "true");
  div.innerHTML = `\n    <div class="project-card__img skeleton-shimmer"></div>\n    <div class="project-card__body">\n      <div class="project-card__tags">\n        <span class="tag skeleton-shimmer skeleton-tag"></span>\n        <span class="tag skeleton-shimmer skeleton-tag"></span>\n      </div>\n      <div class="skeleton-shimmer skeleton-line skeleton-line--title"></div>\n      <div class="skeleton-shimmer skeleton-line"></div>\n      <div class="skeleton-shimmer skeleton-line skeleton-line--short"></div>\n    </div>\n  `;
  return div;
}

function showProjectsEmptyState(grid, onRefresh) {
  grid.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "projects-state glass-card";
  wrap.innerHTML = `\n    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" class="projects-state__icon" aria-hidden="true">\n      <rect x="6" y="10" width="36" height="28" rx="3" />\n      <path d="M6 18h36M16 26h16M16 31h10" />\n    </svg>\n    <h3 class="projects-state__title">No Projects <span class="gradient-text">Available</span></h3>\n    <p class="projects-state__desc">There's nothing to show here right now. Please check back soon.</p>\n    <button type="button" class="btn btn--glass projects-state__action">\n      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4v6h6M20 20v-6h-6M5.5 9A8 8 0 0119 7.5M18.5 15a8 8 0 01-13.5 1.5" /></svg>\n      Refresh\n    </button>\n  `;
  wrap.querySelector(".projects-state__action").addEventListener("click", onRefresh);
  grid.appendChild(wrap);
}

function showProjectsErrorState(grid, onRetry) {
  grid.innerHTML = "";
  const wrap = document.createElement("div");
  wrap.className = "projects-state glass-card";
  wrap.innerHTML = `\n    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" class="projects-state__icon projects-state__icon--error" aria-hidden="true">\n      <circle cx="24" cy="24" r="18" />\n      <path d="M24 16v12M24 32h.01" />\n    </svg>\n    <h3 class="projects-state__title">Couldn't Load <span class="gradient-text">Projects</span></h3>\n    <p class="projects-state__desc">Something went wrong while fetching the project data.</p>\n    <button type="button" class="btn btn--primary projects-state__action">\n      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4v6h6M20 20v-6h-6M5.5 9A8 8 0 0119 7.5M18.5 15a8 8 0 01-13.5 1.5" /></svg>\n      Retry\n    </button>\n  `;
  wrap.querySelector(".projects-state__action").addEventListener("click", onRetry);
  grid.appendChild(wrap);
}

(function initDynamicProjects() {
  const grid = document.querySelector(".projects__grid");
  if (!grid) return;
  function load() {
    const skeletonCount = grid.querySelectorAll(".project-card").length || 6;
    grid.innerHTML = "";
    for (let i = 0; i < skeletonCount; i++) {
      grid.appendChild(buildSkeletonCard());
    }
    getProjects().then(projects => {
      window.__PROJECTS_DATA__ = projects;
      if (!Array.isArray(projects) || projects.length === 0) {
        showProjectsEmptyState(grid, load);
        return;
      }
      grid.innerHTML = "";
      projects.forEach(project => {
        grid.appendChild(buildProjectCard(project));
      });
      if (typeof window.__reapplyProjectFilter__ === "function") {
        window.__reapplyProjectFilter__();
      }
    }).catch(err => {
      console.warn("Could not load projects data:", err.message);
      showProjectsErrorState(grid, load);
    });
  }
  load();
})();

const CONTACT_ICONS = {
  email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M2 4l10 9 10-9" /></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" /><circle cx="4" cy="4" r="2" /></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" /></svg>'
};

(function initDynamicContact() {
  const detailEls = document.querySelectorAll(".contact__detail");
  const headingEl = document.querySelector(".contact__info-heading");
  const subEl = document.querySelector(".contact__info-sub");
  if (!detailEls.length) return;
  getContact().then(contact => {
    if (headingEl && contact.infoHeading) headingEl.textContent = contact.infoHeading;
    if (subEl && contact.infoSub) subEl.textContent = contact.infoSub;
    detailEls.forEach((detailEl, i) => {
      const detail = contact.details && contact.details[i];
      if (!detail) return;
      const iconWrap = detailEl.querySelector(".contact__detail-icon");
      const labelEl = detailEl.querySelector(".contact__detail-label");
      const valueEl = detailEl.querySelector(".contact__detail-value");
      if (iconWrap && CONTACT_ICONS[detail.icon]) {
        iconWrap.innerHTML = CONTACT_ICONS[detail.icon];
      }
      if (labelEl) labelEl.textContent = detail.label;
      if (valueEl) {
        valueEl.textContent = detail.value;
        if (valueEl.tagName === "A") valueEl.href = detail.href;
      }
    });
  }).catch(err => {
    console.warn("Could not load contact data, showing static content instead:", err.message);
  });
})();

(function initDynamicBlog() {
  const blogCards = document.querySelectorAll(".blog-card");
  if (!blogCards.length) return;
  getBlogPosts().then(posts => {
    window.__BLOG_DATA__ = posts;
    blogCards.forEach((cardEl, i) => {
      const post = posts[i];
      if (!post) return;
      const imgEl = cardEl.querySelector(".blog-card__img");
      const titleEl = cardEl.querySelector(".blog-card__title");
      const excerptEl = cardEl.querySelector(".blog-card__excerpt");
      const readMoreBtn = cardEl.querySelector(".blog-card__readmore");
      if (imgEl) {
        imgEl.src = post.image;
        imgEl.alt = post.title;
      }
      if (titleEl) titleEl.textContent = post.title;
      if (excerptEl) excerptEl.textContent = post.excerpt;
      if (readMoreBtn) {
        readMoreBtn.setAttribute("aria-label", "Read more about " + post.title);
      }
    });
  }).catch(err => {
    console.warn("Could not load blog data, showing static content instead:", err.message);
  });
})();

(function initProjectFilters() {
  const filterWrap = document.querySelector(".project-filters");
  const projectsGrid = document.querySelector(".projects__grid");
  if (!filterWrap || !projectsGrid) return;
  function getCards() {
    return Array.from(projectsGrid.querySelectorAll(".project-card"));
  }
  const state = {
    category: "all",
    searchTerm: ""
  };
  function cardMatchesSearch(card, term) {
    if (!term) return true;
    const haystack = (card.querySelector(".project-card__title")?.textContent + " " + card.querySelector(".project-card__desc")?.textContent + " " + Array.from(card.querySelectorAll(".project-card__tags .tag")).map(t => t.textContent).join(" ")).toLowerCase();
    return haystack.includes(term.toLowerCase());
  }
  function applyFilter() {
    getCards().forEach(card => {
      const categoryMatch = state.category === "all" || card.dataset.category === state.category;
      const searchMatch = cardMatchesSearch(card, state.searchTerm);
      const matches = categoryMatch && searchMatch;
      if (matches) {
        card.classList.remove("filtering-hidden", "filtering-out");
        card.classList.add("filtering-in");
        card.removeAttribute("aria-hidden");
        card.setAttribute("tabindex", "0");
      } else {
        card.classList.remove("filtering-in");
        card.classList.add("filtering-out");
        card.setAttribute("aria-hidden", "true");
        card.setAttribute("tabindex", "-1");
        setTimeout(() => {
          if (card.classList.contains("filtering-out")) {
            card.classList.add("filtering-hidden");
          }
        }, 350);
      }
    });
    const hasRealCards = getCards().length > 0;
    const visibleCount = getCards().filter(c => !c.classList.contains("filtering-hidden") && !c.classList.contains("filtering-out")).length;
    let noResultsEl = projectsGrid.querySelector(".projects-no-results");
    if (hasRealCards && visibleCount === 0) {
      if (!noResultsEl) {
        noResultsEl = document.createElement("div");
        noResultsEl.className = "projects-state glass-card projects-no-results";
        noResultsEl.innerHTML = `\n          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" class="projects-state__icon" aria-hidden="true">\n            <circle cx="21" cy="21" r="13" /><path d="M30.5 30.5L40 40" />\n          </svg>\n          <h3 class="projects-state__title">No Matching <span class="gradient-text">Projects</span></h3>\n          <p class="projects-state__desc">Try a different search term or category.</p>\n        `;
        projectsGrid.appendChild(noResultsEl);
      }
    } else if (noResultsEl) {
      noResultsEl.remove();
    }
  }
  filterWrap.addEventListener("click", e => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filterWrap.querySelectorAll(".filter-btn").forEach(b => {
      b.classList.remove("active");
      b.setAttribute("aria-pressed", "false");
    });
    btn.classList.add("active");
    btn.setAttribute("aria-pressed", "true");
    state.category = btn.dataset.filter;
    applyFilter();
  });
  window.__setProjectSearchTerm__ = function(term) {
    state.searchTerm = term;
    applyFilter();
  };
  window.__reapplyProjectFilter__ = function() {
    applyFilter();
  };
})();

(function initProjectSearch() {
  const searchInput = document.getElementById("projectSearchInput");
  if (!searchInput) return;
  searchInput.addEventListener("input", () => {
    if (typeof window.__setProjectSearchTerm__ === "function") {
      window.__setProjectSearchTerm__(searchInput.value.trim());
    }
  });
})();

function week3TrapFocus(container) {
  const focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  let focusables = [];
  function refresh() {
    focusables = Array.from(container.querySelectorAll(focusableSelector));
  }
  function handleKeydown(e) {
    if (e.key !== "Tab") return;
    if (!focusables.length) refresh();
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
  refresh();
  container.addEventListener("keydown", handleKeydown);
  return () => container.removeEventListener("keydown", handleKeydown);
}

(function initProjectModal() {
  const modal = document.getElementById("projectModal");
  const projectsGrid = document.querySelector(".projects__grid");
  if (!modal || !projectsGrid) return;
  const closeBtn = document.getElementById("projectModalClose");
  const titleEl = document.getElementById("projectModalTitle");
  const categoryEl = document.getElementById("projectModalCategory");
  const descEl = document.getElementById("projectModalDesc");
  const techEl = document.getElementById("projectModalTech");
  const githubEl = document.getElementById("projectModalGithub");
  const demoEl = document.getElementById("projectModalDemo");
  const galleryImgs = modal.querySelectorAll(".modal-gallery__img");
  const dotsWrap = document.getElementById("projectModalDots");
  let lastFocused = null;
  let releaseTrap = null;
  let galleryIndex = 0;
  let galleryTimer = null;
  galleryImgs.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", "Show screenshot " + (i + 1));
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => showGalleryImage(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll("button"));
  function showGalleryImage(i) {
    galleryIndex = i;
    galleryImgs.forEach((img, idx) => img.classList.toggle("active", idx === i));
    dots.forEach((d, idx) => d.classList.toggle("active", idx === i));
  }
  function startGalleryAutoplay() {
    stopGalleryAutoplay();
    galleryTimer = setInterval(() => {
      showGalleryImage((galleryIndex + 1) % galleryImgs.length);
    }, 3500);
  }
  function stopGalleryAutoplay() {
    if (galleryTimer) clearInterval(galleryTimer);
  }
  function populateModal(data) {
    titleEl.textContent = data.title;
    categoryEl.textContent = data.category;
    descEl.textContent = data.desc;
    githubEl.href = data.github;
    demoEl.href = data.demo;
    techEl.innerHTML = "";
    data.tech.forEach(t => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = t;
      techEl.appendChild(span);
    });
    showGalleryImage(0);
  }
  function openModal(projectId) {
    const fetched = window.__PROJECTS_DATA__ && window.__PROJECTS_DATA__.find(p => String(p.id) === String(projectId));
    const data = fetched ? {
      title: fetched.title,
      category: fetched.categoryLabel,
      desc: fetched.modalDescription || fetched.description,
      tech: fetched.technologies,
      github: fetched.github,
      demo: fetched.demo
    } : WEEK3_PROJECT_DATA[projectId];
    if (!data) return;
    populateModal(data);
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    releaseTrap = week3TrapFocus(modal.querySelector(".modal-box"));
    closeBtn.focus();
    startGalleryAutoplay();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    stopGalleryAutoplay();
    if (releaseTrap) releaseTrap();
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }
  projectsGrid.addEventListener("click", e => {
    if (e.target.closest(".project-card__action")) return;
    const card = e.target.closest(".project-card");
    if (!card) return;
    openModal(card.dataset.project);
  });
  projectsGrid.addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".project-card");
    if (!card) return;
    if (e.target.closest(".project-card__action")) return;
    e.preventDefault();
    openModal(card.dataset.project);
  });
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
})();

(function initArticleModal() {
  const modal = document.getElementById("articleModal");
  const blogGrid = document.querySelector(".blog__grid");
  if (!modal || !blogGrid) return;
  const closeBtn = document.getElementById("articleModalClose");
  const imgEl = document.getElementById("articleModalImg");
  const titleEl = document.getElementById("articleModalTitle");
  const dateEl = document.getElementById("articleModalDate");
  const readTimeEl = document.getElementById("articleModalReadTime");
  const contentEl = document.getElementById("articleModalContent");
  const tagsEl = document.getElementById("articleModalTags");
  let lastFocused = null;
  let releaseTrap = null;
  function openModal(articleId) {
    const fetched = window.__BLOG_DATA__ && window.__BLOG_DATA__.find(p => String(p.id) === String(articleId));
    const data = fetched ? {
      image: fetched.image,
      title: fetched.title,
      date: fetched.date,
      readTime: fetched.readTime,
      content: fetched.content,
      tags: fetched.tags
    } : WEEK3_ARTICLE_DATA[articleId];
    if (!data) return;
    imgEl.src = data.image;
    imgEl.alt = data.title;
    titleEl.textContent = data.title;
    dateEl.innerHTML = dateEl.querySelector("svg").outerHTML + " " + data.date;
    readTimeEl.innerHTML = readTimeEl.querySelector("svg").outerHTML + " " + data.readTime;
    contentEl.textContent = data.content;
    tagsEl.innerHTML = "";
    data.tags.forEach(tag => {
      const span = document.createElement("span");
      span.className = "tag";
      span.textContent = tag;
      tagsEl.appendChild(span);
    });
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    releaseTrap = week3TrapFocus(modal.querySelector(".modal-box"));
    closeBtn.focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (releaseTrap) releaseTrap();
    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }
  blogGrid.addEventListener("click", e => {
    const btn = e.target.closest("[data-article-trigger]");
    if (!btn) return;
    openModal(btn.dataset.articleTrigger);
  });
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", e => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });
})();

(function initContactValidation() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const fields = {
    fname: {
      el: document.getElementById("fname"),
      errorEl: document.getElementById("fnameError"),
      validate: v => {
        if (!v.trim()) return "Name is required.";
        if (v.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      }
    },
    femail: {
      el: document.getElementById("femail"),
      errorEl: document.getElementById("femailError"),
      validate: v => {
        if (!v.trim()) return "Email is required.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(v.trim())) return "Please enter a valid email address.";
        return "";
      }
    },
    fsubject: {
      el: document.getElementById("fsubject"),
      errorEl: document.getElementById("fsubjectError"),
      validate: v => {
        if (!v.trim()) return "Subject is required.";
        return "";
      }
    },
    fmessage: {
      el: document.getElementById("fmessage"),
      errorEl: document.getElementById("fmessageError"),
      validate: v => {
        if (!v.trim()) return "Message is required.";
        if (v.trim().length < 10) return "Message should be at least 10 characters.";
        return "";
      }
    }
  };
  function showError(field, message) {
    if (!field.errorEl) return;
    field.errorEl.textContent = message;
    field.errorEl.classList.toggle("show", Boolean(message));
    field.el.classList.toggle("invalid", Boolean(message));
    field.el.classList.toggle("valid", !message && field.el.value.trim() !== "");
    field.el.setAttribute("aria-invalid", message ? "true" : "false");
  }
  function validateField(key) {
    const field = fields[key];
    const error = field.validate(field.el.value);
    showError(field, error);
    return !error;
  }
  Object.keys(fields).forEach(key => {
    const field = fields[key];
    if (!field.el) return;
    field.el.setAttribute("aria-describedby", field.errorEl ? field.errorEl.id : "");
    field.el.addEventListener("input", () => validateField(key));
    field.el.addEventListener("blur", () => validateField(key));
  });
  form.addEventListener("submit", e => {
    let allValid = true;
    Object.keys(fields).forEach(key => {
      if (!validateField(key)) allValid = false;
    });
    if (!allValid) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const firstInvalid = form.querySelector(".form-input.invalid");
      if (firstInvalid) firstInvalid.focus();
    }
  }, true);
})();