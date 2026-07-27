/* ==========================================================================
   CYBER TERMINAL & COMMAND PALETTE (CTRL+K / CMD+K / ~)
   - Search & Navigation Palette for instant modal drawer triggers
   - Interactive Terminal mode with commands: help, skills, projects, contact, hire, clear
   ========================================================================== */

export class CommandPaletteEngine {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.modal = null;
    this.input = null;
    this.resultsContainer = null;
    this.isOpen = false;

    this.commands = [
      { id: 'resume', title: 'Open Resume / CV', desc: 'Experience, Education, Certifications & Skills', icon: '📄', action: () => this.openModal('resume') },
      { id: 'projects', title: 'Open Project Case Studies', desc: '7 engineering and AI project walkthroughs', icon: '📁', action: () => this.openModal('projects') },
      { id: 'artworks', title: 'Open Certifications Gallery', desc: '24 Industry Certifications & Training Index', icon: '📜', action: () => this.openModal('artworks') },
      { id: 'contact', title: 'Open Contact Terminal', desc: 'Direct email, phone, and social links', icon: '✉️', action: () => this.openModal('contact') },
      { id: 'crt-toggle', title: 'Toggle CRT Monitor Effect', desc: 'Switch scanlines & glass glare filter on/off', icon: '📺', action: () => this.toggleCRT() },
      { id: 'audio-toggle', title: 'Toggle Mute Sound Effects', desc: 'Synthesizer audio click & hover FX', icon: '🔊', action: () => this.toggleAudio() },
      { id: 'terminal-mode', title: 'Launch Interactive Cyber Terminal', desc: 'Type custom terminal commands (help, projects, hire)', icon: '💻', action: () => this.startTerminalMode() }
    ];

    this.init();
  }

  init() {
    this.createPaletteDOM();
    this.bindEvents();
  }

  createPaletteDOM() {
    const html = `
      <div id="command-palette-modal" class="cmd-palette-backdrop" role="dialog" aria-modal="true" aria-hidden="true" aria-label="Command Palette" tabindex="-1">
        <div class="cmd-palette-container">
          <div class="cmd-palette-header">
            <span class="cmd-prompt-symbol">&gt;_</span>
            <input type="text" id="cmd-palette-input" placeholder="Type a command or search... (Try 'projects', 'resume', 'help')" autocomplete="off" spellcheck="false" />
            <span class="cmd-shortcut-badge">ESC to close</span>
          </div>

          <div class="cmd-palette-body">
            <div id="cmd-palette-results" class="cmd-results-list"></div>
            
            <div id="cmd-terminal-output" class="cmd-terminal-output" style="display: none;">
              <div class="terminal-welcome">
                <span class="term-green">ANUJ YADAV CYBER OS [v2.6.0]</span><br/>
                Type <span class="term-cyan">'help'</span> for list of commands or <span class="term-cyan">'exit'</span> to switch to menu mode.
              </div>
              <div id="term-logs"></div>
            </div>
          </div>

          <div class="cmd-palette-footer">
            <div class="cmd-footer-hint">
              <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Select</span>
              <span><kbd>Ctrl</kbd> + <kbd>K</kbd> Toggle</span>
            </div>
            <span class="cmd-system-tag">CYBER OS v2.6</span>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
    this.modal = document.getElementById('command-palette-modal');
    this.input = document.getElementById('cmd-palette-input');
    this.resultsContainer = document.getElementById('cmd-palette-results');
    this.modal.inert = true;
  }

  bindEvents() {
    // Global hotkey shortcut: Ctrl+K, Cmd+K, or Tilde ~
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.toggle();
      } else if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Close on backdrop click
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.close();
      }
    });

    // Input filter & command execution
    this.input.addEventListener('input', () => {
      if (this.audio) this.audio.playHover();
      this.renderResults(this.input.value.trim());
    });

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = this.input.value.trim().toLowerCase();
        this.handleCommand(value);
      }
    });

    // Delegated click on results
    this.resultsContainer.addEventListener('click', (e) => {
      const item = e.target.closest('.cmd-item');
      if (item) {
        const id = item.getAttribute('data-cmd-id');
        const cmd = this.commands.find(c => c.id === id);
        if (cmd) {
          if (this.audio) this.audio.playClick();
          cmd.action();
        }
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    this.modal.inert = false;
    this.input.value = '';
    this.renderResults('');
    setTimeout(() => this.input.focus(), 50);
    if (this.audio) this.audio.playOpenModal();
  }

  close() {
    this.isOpen = false;
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    this.modal.inert = true;
    document.getElementById('cmd-terminal-output').style.display = 'none';
    this.resultsContainer.style.display = 'block';
  }

  renderResults(query) {
    const q = query.toLowerCase();
    const filtered = this.commands.filter(c => 
      c.title.toLowerCase().includes(q) || 
      c.desc.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );

    if (filtered.length === 0) {
      this.resultsContainer.innerHTML = `
        <div class="cmd-no-results">
          <span>No matching navigation command found. Press <kbd>ENTER</kbd> to execute as terminal command.</span>
        </div>
      `;
      return;
    }

    this.resultsContainer.innerHTML = filtered.map((c, index) => `
      <button type="button" class="cmd-item ${index === 0 ? 'selected' : ''}" data-cmd-id="${c.id}">
        <span class="cmd-icon">${c.icon}</span>
        <div class="cmd-text">
          <div class="cmd-title">${c.title}</div>
          <div class="cmd-desc">${c.desc}</div>
        </div>
        <span class="cmd-arrow">↵</span>
      </button>
    `).join('');
  }

  handleCommand(val) {
    if (!val) return;

    // Check if matching menu item
    const matched = this.commands.find(c => c.id === val || c.title.toLowerCase().includes(val));
    if (matched) {
      matched.action();
      return;
    }

    // Terminal command mode execution
    const termOutput = document.getElementById('cmd-terminal-output');
    const termLogs = document.getElementById('term-logs');
    termOutput.style.display = 'block';
    this.resultsContainer.style.display = 'none';

    let response = '';
    if (val === 'help') {
      response = `Available commands:<br/>
        • <span class="term-cyan">projects</span> - View all 7 engineering projects<br/>
        • <span class="term-cyan">resume</span> - Open complete Curriculum Vitae<br/>
        • <span class="term-cyan">skills</span> - View technical expertise breakdown<br/>
        • <span class="term-cyan">contact</span> - Show email, phone & social chips<br/>
        • <span class="term-cyan">hire</span> - Trigger instant contact submission<br/>
        • <span class="term-cyan">clear</span> - Clear terminal logs<br/>
        • <span class="term-cyan">exit</span> - Return to command palette`;
    } else if (val === 'projects') {
      this.openModal('projects');
      return;
    } else if (val === 'resume' || val === 'skills') {
      this.openModal('resume');
      return;
    } else if (val === 'contact') {
      this.openModal('contact');
      return;
    } else if (val === 'hire') {
      response = `<span class="term-green">🎉 EXCELLENT DECISION! Anuj is currently available for AI & Software Engineering roles! Opening Contact Modal...</span>`;
      setTimeout(() => this.openModal('contact'), 800);
    } else if (val === 'clear') {
      termLogs.innerHTML = '';
      this.input.value = '';
      return;
    } else if (val === 'exit') {
      termOutput.style.display = 'none';
      this.resultsContainer.style.display = 'block';
      this.input.value = '';
      return;
    } else {
      response = `<span class="term-red">Command not recognized: '${val}'. Type 'help' for available commands.</span>`;
    }

    const logEntry = document.createElement('div');
    logEntry.className = 'term-log-entry';
    logEntry.innerHTML = `<span class="term-prompt">guest@anuj-os:~$</span> ${val}<br/>${response}`;
    termLogs.appendChild(logEntry);
    this.input.value = '';
  }

  openModal(modalId) {
    this.close();
    const btn = document.querySelector(`[data-modal="${modalId}"]`);
    if (btn) btn.click();
  }

  toggleCRT() {
    this.close();
    document.body.classList.toggle('crt-active');
  }

  toggleAudio() {
    if (this.audio) {
      const isMuted = this.audio.toggleMute();
      const toast = document.getElementById('toast-notification');
      if (toast) {
        toast.textContent = isMuted ? '🔇 Audio FX Muted' : '🔊 Audio FX Enabled';
        toast.classList.add('active');
        setTimeout(() => toast.classList.remove('active'), 2000);
      }
    }
  }

  startTerminalMode() {
    this.input.value = 'help';
    this.handleCommand('help');
  }
}
