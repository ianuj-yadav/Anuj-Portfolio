/* ==========================================================================
   3-SLIDE INTERACTIVE PROJECT PRESENTATION SHOWCASE CONTROLLER
   - Includes 3-Tab Visual Slide Switcher on Slide 2
   - Developer Credit for ANUJ YADAV
   - Mobile Touch Swipe Gestures
   - Projects Category Filter Bar Handler
   ========================================================================== */

import { gsap } from 'gsap';

export const projectsDatabase = {
  'tdl-gpt': {
    title: 'TDL GPT — AI Code Generator',
    tags: 'Gen AI | Tally 4GL | Python | System Prompts',
    github: 'https://github.com/ianuj-yadav/TDL-gpt.git',
    visuals: {
      ui: '/assets/projects/tdl-gpt-ui.png',
      flow: '/assets/projects/tdl-gpt-flow.png',
      data: '/assets/projects/tdl-gpt-data.png'
    },
    overview: 'Advanced AI chatbot generating accurate Tally Definition Language (TDL 4GL) code with custom system prompts designed specifically for non-procedural syntax.',
    bullets: [
      'Interprets non-procedural TDL domain syntax to auto-generate accounting report definitions.',
      'Includes custom system prompt engineering to enforce strict syntax validation rules.',
      'Reduces TDL development iteration time by over 70% for enterprise ERP developers.'
    ],
    code: `// TDL System Prompt Architecture
system_prompt = """
You are a TDL (Tally Definition Language) 4GL Code Generator.
Generate valid definitions using [Report], [Form], [Part], [Line], and [Field].
"""

[Report: CustomLedgerReport]
  Form: CustomLedgerForm

[Form: CustomLedgerForm]
  Parts: LedgerHeaderPart, LedgerBodyPart`
  },

  'notes-elitehub': {
    title: 'Notes-Elitehub Platform',
    tags: 'Node.js | Express | PostgreSQL | Auth',
    github: 'https://github.com/ianuj-yadav/Notes-Elite-HUB.git',
    visuals: {
      ui: '/assets/projects/notes-elitehub-ui.png',
      flow: '/assets/projects/notes-elitehub-flow.png',
      data: '/assets/projects/notes-elitehub-data.png'
    },
    overview: 'Engineered full backend architecture for an advanced note-taking platform with relational DB schema, user authentication, and CRUD REST APIs.',
    bullets: [
      'Relational PostgreSQL schema with foreign keys and index optimization.',
      'Role-based JWT authentication and bcrypt password hashing.',
      'Modular RESTful API endpoints for note categorization, tags, and rich content.'
    ],
    code: `// PostgreSQL Users & Notes Schema
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

router.post('/api/notes', authenticateToken, async (req, res) => {
  const { title, content, tags } = req.body;
  const note = await db.query('INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *', [req.user.id, title, content]);
  res.json(note.rows[0]);
});`
  },

  'visual-dsa': {
    title: 'Visual DSA Algorithm Platform',
    tags: 'Python | Data Structures | Graph Math | Team Lead',
    github: 'https://github.com/ianuj-yadav/Visual-Dsa-Algorithm.git',
    visuals: {
      ui: '/assets/projects/visual-dsa-ui.png',
      flow: '/assets/projects/visual-dsa-flow.png',
      data: '/assets/projects/visual-dsa-data.png'
    },
    overview: 'Lead Backend Developer in a 4-person engineering team architecting an interactive platform to visualize complex Data Structures & Algorithms.',
    bullets: [
      'Led backend development across a 4-person developer team.',
      'Implemented graph algorithms (Dijkstra, BFS, DFS) with state-machine step tracking.',
      'Real-time visualization engine mapping execution states to visual graph nodes.'
    ],
    code: `# Dijkstra Shortest Path Engine
def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    step_history = []
    
    while pq:
        current_dist, current_node = heapq.heappop(pq)
        step_history.append({'activeNode': current_node, 'distances': dict(distances)})
        
        for neighbor, weight in graph[current_node].items():
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
                
    return step_history`
  },

  'ams-dashboard': {
    title: 'Attendance Management System (AMS)',
    tags: 'Python | Java | RBAC Roles | Security',
    github: 'https://github.com/ianuj-yadav/AMS.git',
    visuals: {
      ui: '/assets/projects/ams-dashboard-ui.png',
      flow: '/assets/projects/ams-dashboard-flow.png',
      data: '/assets/projects/ams-dashboard-data.png'
    },
    overview: 'Automated tracking of student & employee attendance with Role-Based Access Control (Admin, Teacher, Student) and daily automated reporting.',
    bullets: [
      'Role-Based Access Control (RBAC) separating Admin, Teacher, and Student permissions.',
      'Automated daily summary report generator sending email alerts to administrators.',
      'Comprehensive security controls and audit logging for attendance tampering prevention.'
    ],
    code: `// Role-Based Access Control Middleware
class SecurityGuard {
  public boolean verifyRole(UserSession session, UserRole requiredRole) {
    if (session == null || !session.isAuthenticated()) return false;
    return session.getRole().hasPermission(requiredRole);
  }
}

// Attendance Auto-Reporting Cron
def generate_daily_attendance_summary(date):
    records = AttendanceRecord.query.filter_by(date=date).all()
    stats = compute_present_absent_ratio(records)
    send_admin_email_digest(stats)`
  },

  'ai-chatbot': {
    title: 'Conversational AI ChatBot Platform',
    tags: 'Python | OpenAI API | NLP | Conversational UI',
    github: 'https://github.com/ianuj-yadav/ChatBot.git',
    visuals: {
      ui: '/assets/projects/ai-chatbot-ui.png',
      flow: '/assets/projects/ai-chatbot-flow.png',
      data: '/assets/projects/ai-chatbot-data.png'
    },
    overview: 'Intelligent conversational AI chatbot system featuring streaming responses, context memory, and customizable UI embed widgets.',
    bullets: [
      'Real-time token streaming response generation for fluid conversation experience.',
      'Session context memory management maintaining multi-turn dialogue history.',
      'Embeddable JavaScript widget for instant website deployment.'
    ],
    code: `# Streaming Conversational Engine
async def generate_chat_stream(messages_history):
    response = await client.chat.completions.create(
        model="gpt-4o",
        messages=messages_history,
        stream=True
    )
    async for chunk in response:
        if chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content`
  },

  'classic-piano': {
    title: 'Classic Web Piano Synthesizer',
    tags: 'JavaScript | Web Audio API | Synth DSP | HTML5',
    github: 'https://github.com/ianuj-yadav/CLASSIC-PIANO.git',
    visuals: {
      ui: '/assets/projects/classic-piano-ui.png',
      flow: '/assets/projects/classic-piano-flow.png',
      data: '/assets/projects/classic-piano-data.png'
    },
    overview: 'Interactive polyphonic web piano synthesizer built with Web Audio API, keyboard mapping, and realistic audio envelope synthesis.',
    bullets: [
      'Polyphonic Web Audio API synthesis generating real-time sine/sawtooth sound waves.',
      'Full QWERTY keyboard shortcut mapping for natural music playback.',
      'ADSR audio envelope filter for realistic piano sound decay.'
    ],
    code: `// Web Audio API Synthesizer Node
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playKey(frequency) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(frequency, audioCtx.currentTime);
  
  gain.gain.setValueAtTime(0.8, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 1.2);
}`
  },

  'bilingual-calendar': {
    title: 'Bilingual Calendar & Event System',
    tags: 'JavaScript | Localization | Event Scheduler | CSS3',
    github: 'https://github.com/ianuj-yadav/BILINGUAL-CALENDER.git',
    visuals: {
      ui: '/assets/projects/bilingual-calendar-ui.png',
      flow: '/assets/projects/bilingual-calendar-flow.png',
      data: '/assets/projects/bilingual-calendar-data.png'
    },
    overview: 'Dual-language event calendar and scheduling web application supporting English & Hindi i18n localization and event reminders.',
    bullets: [
      'Seamless multi-language switching between English & Hindi (i18n).',
      'Event scheduler with local storage persistence and event reminder alerts.',
      'Responsive month, week, and daily schedule views.'
    ],
    code: `// i18n Localization Engine
const translations = {
  en: { months: ["January", "February", "March", "April", ...], addEvent: "Add Event" },
  hi: { months: ["जनवरी", "फरवरी", "मार्च", "अप्रैल", ...], addEvent: "इवेंट जोड़ें" }
};

function renderCalendar(locale = "en") {
  const monthName = translations[locale].months[currentMonth];
  document.getElementById("month-display").textContent = monthName;
}`
  }
};

export class ProjectCarouselController {
  constructor() {
    this.modal = document.getElementById('modal-project-carousel');
    this.stage = document.getElementById('carousel-stage');
    this.carouselBody = document.querySelector('.carousel-body');
    this.currentProjectKey = null;
    this.currentSlide = 0;
    this.currentVisualType = 'ui';
    this.currentCasePanel = 'overview';

    // Touch Swipe Variables
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.setupListeners();
    this.setupCategoryFilters();
  }

  setupListeners() {
    // Project Card Click Listener
    const projectCards = document.querySelectorAll('[data-project-key]');
    projectCards.forEach(card => {
      card.addEventListener('click', () => {
        const key = card.getAttribute('data-project-key');
        this.openProjectCaseStudy(key);
      });
    });

    const caseCloseBtn = document.getElementById('case-study-close-btn');
    if (caseCloseBtn) caseCloseBtn.addEventListener('click', () => this.close());

    document.querySelectorAll('.case-tab').forEach(btn => {
      btn.addEventListener('click', () => this.selectCasePanel(btn.getAttribute('data-case-panel')));
    });

    document.querySelectorAll('.case-visual-btn').forEach(btn => {
      btn.addEventListener('click', () => this.switchCaseVisual(btn.getAttribute('data-case-visual')));
    });

    // Close button
    const closeBtn = document.getElementById('carousel-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    // Prev / Next Nav Buttons
    const prevBtn = document.getElementById('carousel-prev-btn');
    const nextBtn = document.getElementById('carousel-next-btn');

    if (prevBtn) prevBtn.addEventListener('click', () => this.prevSlide());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextSlide());

    // Dot indicators
    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const slideIdx = parseInt(dot.getAttribute('data-slide'));
        this.goToSlide(slideIdx);
      });
    });

    // Slide 2 Tab Switcher buttons
    const tabBtns = document.querySelectorAll('.slide2-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const visualType = btn.getAttribute('data-visual');
        this.switchSlide2Visual(visualType);
      });
    });

    // Keyboard Arrow Navigation & Esc Key Listener
    window.addEventListener('keydown', (e) => {
      if (!this.modal || !this.modal.classList.contains('active')) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const panels = ['overview', 'visual', 'architecture'];
        const currentIndex = panels.indexOf(this.currentCasePanel);
        const direction = e.key === 'ArrowRight' ? 1 : -1;
        this.selectCasePanel(panels[(currentIndex + direction + panels.length) % panels.length]);
      } else if (e.key === 'Escape') {
        this.close();
      }
    });

    // Mobile Touch Swipe Gesture Listeners
    if (this.carouselBody) {
      this.carouselBody.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      this.carouselBody.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipeGesture();
      }, { passive: true });
    }
  }

  handleSwipeGesture() {
    const swipeDistance = this.touchEndX - this.touchStartX;
    const minSwipeDistance = 45;

    if (swipeDistance < -minSwipeDistance) {
      // Swiped Left -> Next Slide
      this.nextSlide();
    } else if (swipeDistance > minSwipeDistance) {
      // Swiped Right -> Prev Slide
      this.prevSlide();
    }
  }

  setupCategoryFilters() {
    // 1. Filter Buttons Handler (both Landing & Modal Drawer)
    const allFilterBtns = document.querySelectorAll('.filter-chip-btn');
    
    allFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-filter') || btn.getAttribute('data-landing-filter');
        if (!category) return;

        const parentBar = btn.closest('.filter-chips, #landing-projects-filter');
        if (parentBar) {
          parentBar.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }

        // Determine container
        const container = btn.closest('.framer-projects-drawer') 
          ? document.getElementById('projects-grid-container') 
          : document.getElementById('landing-projects-grid') || document;

        const cards = container.querySelectorAll('.premium-project-card, .confidential-folder-card');

        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            card.style.display = '';
            gsap.fromTo(card, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, overwrite: 'auto' });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // 2. Real-Time Search Bar Handler
    const searchInput = document.getElementById('project-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const cards = document.querySelectorAll('#projects-grid-container .premium-project-card');

        cards.forEach(card => {
          const title = card.querySelector('.premium-project-title')?.textContent.toLowerCase() || '';
          const desc = card.querySelector('.premium-project-desc')?.textContent.toLowerCase() || '';
          const tags = card.querySelector('.premium-tech-tags')?.textContent.toLowerCase() || '';

          if (query === '' || title.includes(query) || desc.includes(query) || tags.includes(query)) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
  }

  openProjectCaseStudy(key) {
    const data = projectsDatabase[key];
    if (!data || !this.modal) return;

    this.currentProjectKey = key;
    this.currentVisualType = 'ui';
    const selectedCard = document.querySelector(`[data-project-key="${key}"]`);
    const category = selectedCard?.getAttribute('data-category') || 'project';
    const categoryLabels = {
      ai: 'GENERATIVE AI & LLM',
      fullstack: 'FULL-STACK PRODUCT',
      systems: 'SYSTEMS & ALGORITHMS',
      audio: 'INTERACTIVE WEB AUDIO'
    };

    document.getElementById('case-project-category').textContent = `${categoryLabels[category] || 'PROJECT'} CASE STUDY`;
    document.getElementById('case-project-title').textContent = data.title;
    document.getElementById('case-project-summary').textContent = data.overview;
    document.getElementById('case-project-github').href = data.github;
    document.getElementById('case-project-stack').textContent = data.tags.split('|').map(tag => tag.trim()).join(' · ');
    document.getElementById('case-project-code').textContent = data.code;

    const bulletsContainer = document.getElementById('case-project-points');
    bulletsContainer.innerHTML = '';
    data.bullets.forEach(point => {
      const item = document.createElement('li');
      item.textContent = point;
      bulletsContainer.appendChild(item);
    });

    this.switchCaseVisual('ui', true);
    this.selectCasePanel('overview');

    const projectsDrawer = document.getElementById('modal-projects');
    if (projectsDrawer?.classList.contains('active')) {
      window.portfolioModalManager?.close(projectsDrawer);
    }

    if (window.portfolioModalManager) {
      window.portfolioModalManager.open(this.modal, document.activeElement);
    } else {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  selectCasePanel(panel) {
    if (!panel) return;
    this.currentCasePanel = panel;

    document.querySelectorAll('.case-tab').forEach(tab => {
      const active = tab.getAttribute('data-case-panel') === panel;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });

    document.querySelectorAll('.case-panel').forEach(panelElement => {
      panelElement.hidden = panelElement.id !== `case-panel-${panel}`;
    });
  }

  switchCaseVisual(type, immediate = false) {
    const data = projectsDatabase[this.currentProjectKey];
    if (!data) return;

    this.currentVisualType = type;
    const image = document.getElementById('case-project-image');
    const caption = document.getElementById('case-project-caption');
    const labels = {
      ui: 'Product interface and interaction direction',
      flow: 'System workflow and component relationship',
      data: 'Data model, technical details, and specifications'
    };

    document.querySelectorAll('.case-visual-btn').forEach(button => {
      const active = button.getAttribute('data-case-visual') === type;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    const updateImage = () => {
      image.src = data.visuals[type];
      image.alt = `${data.title} — ${labels[type]}`;
      caption.textContent = labels[type];
    };

    if (immediate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      updateImage();
      return;
    }

    gsap.to(image, {
      opacity: 0,
      scale: 0.985,
      duration: 0.14,
      onComplete: () => {
        updateImage();
        gsap.to(image, { opacity: 1, scale: 1, duration: 0.22 });
      }
    });
  }

  openProject(key) {
    const data = projectsDatabase[key];
    if (!data || !this.modal) return;

    this.currentProjectKey = key;
    this.currentSlide = 0;
    this.currentVisualType = 'ui';

    // Populate Slide 1: Overview
    document.getElementById('carousel-project-title').textContent = data.title;
    document.getElementById('carousel-project-tags').textContent = `${data.tags} • BY ANUJ YADAV`;
    document.getElementById('slide1-title').textContent = data.title;
    document.getElementById('slide1-desc').textContent = data.overview;
    document.getElementById('slide1-github-btn').href = data.github;

    const bulletsContainer = document.getElementById('slide1-bullets');
    bulletsContainer.innerHTML = '';
    data.bullets.forEach(b => {
      const li = document.createElement('li');
      li.textContent = b;
      bulletsContainer.appendChild(li);
    });

    // Populate Slide 2 Visuals
    this.switchSlide2Visual('ui');

    // Populate Slide 3: Code
    document.getElementById('slide3-code').textContent = data.code;

    // Reset slide position
    this.goToSlide(0);

    const projectsDrawer = document.getElementById('modal-projects');
    if (projectsDrawer?.classList.contains('active')) {
      window.portfolioModalManager?.close(projectsDrawer);
    }

    if (window.portfolioModalManager) {
      window.portfolioModalManager.open(this.modal, document.activeElement);
    } else {
      this.modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  switchSlide2Visual(type) {
    const data = projectsDatabase[this.currentProjectKey];
    if (!data) return;

    this.currentVisualType = type;
    const imgEl = document.getElementById('slide2-img');
    const captionEl = document.getElementById('slide2-caption');
    const tabs = document.querySelectorAll('.slide2-tab-btn');

    tabs.forEach(tab => {
      if (tab.getAttribute('data-visual') === type) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    gsap.to(imgEl, {
      opacity: 0,
      scale: 0.98,
      duration: 0.15,
      onComplete: () => {
        imgEl.src = data.visuals[type];
        
        let label = 'UI Screenshot';
        if (type === 'flow') label = 'System Architecture & Workflow Diagram';
        if (type === 'data') label = 'Data Schema & Tech Specifications';
        
        captionEl.textContent = `${data.title} — ${label} (Developed by Anuj Yadav)`;

        gsap.to(imgEl, {
          opacity: 1,
          scale: 1,
          duration: 0.25
        });
      }
    });
  }

  close() {
    if (this.modal) {
      if (window.portfolioModalManager) {
        window.portfolioModalManager.close(this.modal);
      } else {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }

  goToSlide(index) {
    this.currentSlide = index;
    const offsetPercent = -(index * 33.3333);
    
    if (this.stage) {
      this.stage.style.transform = `translateX(${offsetPercent}%)`;
    }

    const dots = document.querySelectorAll('.indicator-dot');
    dots.forEach((dot, idx) => {
      if (idx === index) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    const counterText = document.getElementById('slide-counter-text');
    if (counterText) {
      counterText.textContent = `SLIDE ${index + 1} OF 3`;
    }
  }

  nextSlide() {
    const nextIdx = (this.currentSlide + 1) % 3;
    this.goToSlide(nextIdx);
  }

  prevSlide() {
    const prevIdx = (this.currentSlide - 1 + 3) % 3;
    this.goToSlide(prevIdx);
  }
}
