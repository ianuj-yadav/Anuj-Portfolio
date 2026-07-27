import React, { useState, useEffect, useRef } from 'react';
import CrtColorBars from './CrtColorBars';
import TerminalBoot from './TerminalBoot';
import './intro.css';

export default function IntroSequence() {
  const [phase, setPhase] = useState('CRT'); // 'CRT' | 'TERMINAL' | 'FINISHED'
  const [isFadingOut, setIsFadingOut] = useState(false);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    let timer;
    if (phase === 'CRT') {
      timer = setTimeout(() => {
        setPhase('TERMINAL');
      }, 2200);
    }
    
    const handleKeyDown = (e) => {
      if (e.key === ' ' || e.key === 'Escape') {
        skipIntro();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase]);

  const dispatchReadyEvent = () => {
    document.dispatchEvent(new CustomEvent('intro:finished'));
  };

  const triggerFadeOut = () => {
    if (hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;
    setIsFadingOut(true);

    const introScreen = document.getElementById('intro-screen');
    if (introScreen) {
      introScreen.style.transition = 'opacity 0.6s ease';
      introScreen.style.opacity = '0';
      introScreen.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      setPhase('FINISHED');
      if (introScreen) {
        introScreen.style.display = 'none';
      }
      dispatchReadyEvent();
    }, 600);
  };

  const skipIntro = () => {
    if (hasTriggeredRef.current || phase === 'FINISHED') return;
    sessionStorage.setItem('introPlayed', 'true');
    triggerFadeOut();
  };

  const finishIntro = () => {
    if (hasTriggeredRef.current || phase === 'FINISHED') return;
    sessionStorage.setItem('introPlayed', 'true');
    triggerFadeOut();
  };

  if (phase === 'FINISHED') return null;

  return (
    <div className={`intro-sequence-wrapper ${isFadingOut ? 'fade-out' : ''}`}>
      {phase === 'CRT' && <CrtColorBars onSkip={skipIntro} />}
      {phase === 'TERMINAL' && <TerminalBoot onComplete={finishIntro} onSkip={skipIntro} />}
    </div>
  );
}
