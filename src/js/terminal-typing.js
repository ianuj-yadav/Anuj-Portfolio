import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initTerminalTyping() {
  const terminalText = document.getElementById('typewriter-text');
  if (!terminalText) return;

  const paragraph1 = `// Results-driven Computer Science Engineer specializing in Generative AI, real-time voice assistants (Gemini 2.0 Live), automated data ingestion pipelines, and full-stack web applications.`;
  const paragraph2 = `// AI Developer Intern @ Binarysoft Technologies | Built Sandra AI Voice Assistant @ Built with AI Bootcamp (Google for Developers) | Microsoft Azure Cloud Certified Bootcamp.`;

  terminalText.innerHTML = '';
  
  const p1 = document.createElement('div');
  p1.style.marginBottom = '16px';
  p1.style.color = '#e4e4e4';
  p1.textContent = paragraph1; // Default content so it is NEVER blank
  
  const p2 = document.createElement('div');
  p2.style.color = '#a39cae';
  p2.textContent = paragraph2; // Default content so it is NEVER blank

  terminalText.appendChild(p1);
  terminalText.appendChild(p2);

  let isTyping = false;

  const startTyping = () => {
    if (isTyping) return;
    isTyping = true;

    p1.textContent = '';
    p2.textContent = '';

    let i1 = 0;
    let i2 = 0;

    function typeFirstParagraph() {
      if (i1 <= paragraph1.length) {
        p1.textContent = paragraph1.slice(0, i1);
        i1++;
        setTimeout(typeFirstParagraph, 10);
      } else {
        setTimeout(typeSecondParagraph, 100);
      }
    }

    function typeSecondParagraph() {
      if (i2 <= paragraph2.length) {
        p2.textContent = paragraph2.slice(0, i2);
        i2++;
        setTimeout(typeSecondParagraph, 10);
      }
    }

    typeFirstParagraph();
  };

  ScrollTrigger.create({
    trigger: '.about-terminal-card',
    start: 'top 95%',
    onEnter: startTyping,
    onRefresh: (self) => {
      if (self.progress > 0) startTyping();
    }
  });

  // Safety trigger: if user is already viewing the section
  const rect = terminalText.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    startTyping();
  }
  setTimeout(startTyping, 500);
}
