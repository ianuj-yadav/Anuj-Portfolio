/* ==========================================================================
   INTERACTIVE EMBEDDABLE AI ASSISTANT CHATBOT WIDGET ("ANUJ-BOT")
   - Simulates Anuj's real-world AI Chatbot Embed project at Binarysoft Tech
   - Features prompt streaming, suggested prompt chips, and instant answers
   ========================================================================== */

export class AIChatbotEngine {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.widget = null;
    this.launcherBtn = null;
    this.chatBody = null;
    this.inputField = null;
    this.isOpen = false;
    this.isTyping = false;

    this.knowledgeBase = [
      {
        keywords: ['who', 'about', 'anuj', 'background', 'intro', 'bio'],
        answer: "I am **Anuj Yadav**, a B.Tech Computer Science Engineering student at Amity University (CGPA 7.89/10) and AI & Software Developer Intern at **Binarysoft Technologies**. I specialize in building LLM Chatbots, Web Automation Pipelines, and Full-Stack Systems!"
      },
      {
        keywords: ['project', 'work', 'build', 'portfolio', 'created'],
        answer: "Anuj has built 7 real engineering projects! Including an **AI Chatbot Integration System**, an **Automated AI News & Market Data Generator**, an **Attendance Management System (AMS)** with RBAC, and an **Interactive DSA Visualization Platform**. Click 'PROJECTS' in the menu to explore all 7 dossier files!"
      },
      {
        keywords: ['skill', 'stack', 'technologies', 'tech', 'language', 'python', 'java', 'react'],
        answer: "Anuj's key technical skills include:\n• **AI & Gen AI:** Prompt Engineering, RAG Pipelines, OpenAI/Claude APIs, LangChain basics\n• **Languages:** Java, Python, JavaScript, HTML5/CSS3, SQL\n• **Web & DB:** Node.js, Express, REST APIs, PostgreSQL, MySQL\n• **Tools & Cloud:** AWS, Azure, Docker, Git, Power BI"
      },
      {
        keywords: ['experience', 'internship', 'binarysoft', 'deloitte', 'job'],
        answer: "Anuj's experience highlights:\n1. **Binarysoft Technologies (May 2026 - Present):** AI & Software Developer Intern building AI chatbot embeds & hybrid fallback query routers.\n2. **Deloitte (Jun 2026 - Jul 2026):** Data Analyst Virtual Intern analyzing forensic data with Python & Power BI."
      },
      {
        keywords: ['contact', 'email', 'hire', 'phone', 'reach', 'linkedin', 'github'],
        answer: "You can reach Anuj directly:\n• ✉️ Email: **ianujy@gmail.com**\n• 📞 Phone: **+91-7838042623**\n• 💼 LinkedIn: linkedin.com/in/anuj-yadav\n• 🐙 GitHub: github.com/ianuj-yadav"
      },
      {
        keywords: ['certificate', 'aws', 'azure', 'anthropic'],
        answer: "Anuj holds **24 industry certifications**! Key highlights: AWS Fundamentals of Machine Learning, AWS Prompt Engineering, Microsoft Azure Bootcamp, Anthropic AI Fluency, and Cisco Cybersecurity. Click 'CERTIFICATIONS' in the nav to check the full gallery!"
      }
    ];

    this.init();
  }

  init() {
    this.createWidgetDOM();
    this.bindEvents();
  }

  createWidgetDOM() {
    const html = `
      <div id="ai-chatbot-widget" class="ai-chatbot-widget">
        <!-- Floating Launcher Button -->
        <button id="ai-chat-launcher" class="ai-chat-launcher" aria-label="Ask Anuj's AI Assistant">
          <div class="launcher-avatar">🤖</div>
          <div class="launcher-pulse"></div>
          <span class="launcher-tooltip">Ask ANUJ-BOT ✦</span>
        </button>

        <!-- Chat Window Drawer -->
        <div id="ai-chat-window" class="ai-chat-window">
          <div class="chat-window-header">
            <div class="chat-header-info">
              <div class="bot-status-indicator"></div>
              <div>
                <h4 class="bot-name">ANUJ-BOT ✦ AI ASSISTANT</h4>
                <span class="bot-subtitle">Trained on Anuj's Resume, Projects & Stack</span>
              </div>
            </div>
            <button id="ai-chat-close" class="chat-close-btn" aria-label="Close Chat">&times;</button>
          </div>

          <div id="ai-chat-body" class="chat-window-body">
            <div class="chat-msg bot-msg">
              <div class="msg-avatar">🤖</div>
              <div class="msg-bubble">
                Hello! I am <strong>ANUJ-BOT</strong>, an embeddable AI widget engineered by Anuj Yadav. How can I assist you today?
              </div>
            </div>

            <!-- Quick Prompt Suggestions Chips -->
            <div class="chat-prompt-chips" id="chat-prompt-chips">
              <button class="prompt-chip" data-query="Who is Anuj Yadav?">Who is Anuj?</button>
              <button class="prompt-chip" data-query="What are Anuj's top projects?">Top Projects 📁</button>
              <button class="prompt-chip" data-query="What is Anuj's tech stack?">Tech Stack ⚡</button>
              <button class="prompt-chip" data-query="How can I contact Anuj?">Contact Anuj ✉️</button>
            </div>
          </div>

          <div class="chat-window-footer">
            <input type="text" id="ai-chat-input" placeholder="Ask anything about Anuj..." autocomplete="off" spellcheck="false" />
            <button id="ai-chat-send" class="chat-send-btn" aria-label="Send message">➔</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    this.widget = document.getElementById('ai-chatbot-widget');
    this.launcherBtn = document.getElementById('ai-chat-launcher');
    this.chatBody = document.getElementById('ai-chat-body');
    this.inputField = document.getElementById('ai-chat-input');

    const chatWindow = document.getElementById('ai-chat-window');
    chatWindow.style.display = 'none';
  }

  bindEvents() {
    this.launcherBtn.addEventListener('click', () => this.toggleChat());
    document.getElementById('ai-chat-close').addEventListener('click', () => this.closeChat());

    document.getElementById('ai-chat-send').addEventListener('click', () => {
      this.handleUserSend();
    });

    this.inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this.handleUserSend();
      }
    });

    // Prompt Chips Listener
    const chipsContainer = document.getElementById('chat-prompt-chips');
    if (chipsContainer) {
      chipsContainer.addEventListener('click', (e) => {
        const chip = e.target.closest('.prompt-chip');
        if (chip) {
          const query = chip.getAttribute('data-query');
          this.inputField.value = query;
          this.handleUserSend();
        }
      });
    }
  }

  toggleChat() {
    if (this.isOpen) {
      this.closeChat();
    } else {
      this.openChat();
    }
  }

  openChat() {
    this.isOpen = true;
    const windowEl = document.getElementById('ai-chat-window');
    windowEl.style.display = 'flex';
    setTimeout(() => windowEl.classList.add('active'), 10);
    this.launcherBtn.classList.add('active');
    setTimeout(() => this.inputField.focus(), 150);
    if (this.audio) this.audio.playOpenModal();
  }

  closeChat() {
    this.isOpen = false;
    const windowEl = document.getElementById('ai-chat-window');
    windowEl.classList.remove('active');
    setTimeout(() => {
      windowEl.style.display = 'none';
    }, 200);
    this.launcherBtn.classList.remove('active');
  }

  handleUserSend() {
    const text = this.inputField.value.trim();
    if (!text || this.isTyping) return;

    if (this.audio) this.audio.playClick();
    this.appendUserMessage(text);
    this.inputField.value = '';

    // Hide chips after first message
    const chips = document.getElementById('chat-prompt-chips');
    if (chips) chips.style.display = 'none';

    this.isTyping = true;
    this.showTypingIndicator();

    setTimeout(() => {
      this.removeTypingIndicator();
      const response = this.generateBotResponse(text);
      this.streamBotMessage(response);
    }, 600);
  }

  appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user-msg';
    msgDiv.innerHTML = `
      <div class="msg-bubble">${this.escapeHTML(text)}</div>
    `;
    this.chatBody.appendChild(msgDiv);
    this.scrollToBottom();
  }

  showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'chat-typing-indicator';
    typingDiv.className = 'chat-msg bot-msg';
    typingDiv.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-bubble typing-dots">
        <span></span><span></span><span></span>
      </div>
    `;
    this.chatBody.appendChild(typingDiv);
    this.scrollToBottom();
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('chat-typing-indicator');
    if (indicator) indicator.remove();
  }

  generateBotResponse(input) {
    const text = input.toLowerCase();
    
    for (const item of this.knowledgeBase) {
      if (item.keywords.some(k => text.includes(k))) {
        return item.answer;
      }
    }

    return "That's a great question! Anuj Yadav is an AI & Software Developer specializing in Gen AI, LLM Chatbots, Full-Stack Node/React, and DSA in Java/Python. Feel free to open his Resume or Projects modal from the navigation menu for complete details!";
  }

  streamBotMessage(fullText) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg bot-msg';
    msgDiv.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-bubble bot-content"></div>
    `;
    this.chatBody.appendChild(msgDiv);
    const contentEl = msgDiv.querySelector('.bot-content');

    let index = 0;
    const formattedText = fullText.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Typewriter effect simulation
    const interval = setInterval(() => {
      if (index < formattedText.length) {
        contentEl.innerHTML = formattedText.substring(0, index + 4);
        index += 4;
        if (this.audio && Math.random() < 0.3) this.audio.playChatTyping();
        this.scrollToBottom();
      } else {
        contentEl.innerHTML = formattedText;
        clearInterval(interval);
        this.isTyping = false;
        this.scrollToBottom();
      }
    }, 20);
  }

  scrollToBottom() {
    this.chatBody.scrollTop = this.chatBody.scrollHeight;
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
}
