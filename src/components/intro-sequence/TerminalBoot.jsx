

import React, { useState, useEffect, useRef } from 'react';
import './intro.css';

const bootSequence = [
  { text: 'ANUJ NEURAL BOOT SEQUENCE v1.3', type: 'header', delay: 180 },
  { text: 'DEEP SIGNAL SCAN ................[LOCKED]', type: 'log', delay: 140 },
  { text: 'COSMIC NETWORK LINK .............[ESTABLISHED]', type: 'log', delay: 100 },
  { text: 'CREATIVE MATRIX .................[ONLINE]', type: 'log', delay: 80 },
  { text: 'VISUAL CORTEX ...................[SYNCHRONIZED]', type: 'log', delay: 80 },
  { text: 'NEURAL CANVAS ...................[LOADED]', type: 'log', delay: 80 },
  { text: 'STYLE MATRIX ....................[STABLE]', type: 'log', delay: 80 },
  { text: 'ARTWORK ENGINE ..................[ACTIVE]', type: 'log', delay: 80 },
  { text: 'PROJECT GRID ....................[MOUNTED]', type: 'log', delay: 80 },
  { text: 'SYSTEM DIAGNOSTICS', type: 'header', delay: 180 },
  { text: 'MEMORY BANK .....................[CLEAR]', type: 'log', delay: 80 },
  { text: 'ERROR TRACE .....................[NONE]', type: 'log', delay: 80 },
  { text: 'LATENCY .........................[9.01ms]', type: 'log', delay: 80 },
  { text: 'CREATIVE POWER ..................[99%]', type: 'log', delay: 80 },
  { text: 'IMAGINATION CORE ................[FLOWING]', type: 'log', delay: 120 },
  { text: 'SUBSYSTEM INITIALIZATION', type: 'header', delay: 180 },
  { text: 'INSPIRATION ENGINE ..............[ACTIVE]', type: 'log', delay: 80 },
  { text: 'IDEA GENERATOR ..................[GENERATING]', type: 'log', delay: 80 },
  { text: 'VISUAL LIBRARY ..................[INDEXED]', type: 'log', delay: 80 },
  { text: 'CONCEPT ARCHIVE .................[SYNCED]', type: 'log', delay: 80 },
  { text: 'REALITY DISTORTION MODULE .......[ENABLED]', type: 'log', delay: 80 },
  { text: 'IDENTITY PROTOCOL', type: 'header', delay: 180 },
  { text: 'CREATOR SIGNATURE ...............[VERIFIED]', type: 'log', delay: 80 },
  { text: 'ACCESS LEVEL ....................[OMEGA PRIME]', type: 'log', delay: 80 },
  { text: 'NEURAL LINK .....................[STABLE]', type: 'log', delay: 80 },
  { text: 'GALACTIC CREATIVE SYSTEM READY', type: 'success', delay: 250 },
  { text: 'WELCOME, FRIEND', type: 'success', delay: 150 },
  { text: 'IT\'S ALWAYS NICE TO SEE YOU', type: 'success', delay: 150 },
  { text: 'HAVE A NICE DAY', type: 'success', delay: 150 },
  { text: 'ENTERING ANUJ PORTFOLIO...', type: 'success', delay: 250 },
  { text: 'EXPANDING CREATIVE UNIVERSE', type: 'success', delay: 300 }
];

export default function TerminalBoot({ onComplete, onSkip }) {
  const [lines, setLines] = useState([]);
  const logsEndRef = useRef(null);

  useEffect(() => {
    let currentIdx = 0;
    let timeout;
    let isMounted = true;
    
    const nextLine = () => {
      if (!isMounted) return;
      if (currentIdx < bootSequence.length) {
        setLines(prev => [...prev, bootSequence[currentIdx]]);
        timeout = setTimeout(nextLine, bootSequence[currentIdx].delay);
        currentIdx++;
      } else {
        timeout = setTimeout(() => {
          if (isMounted) onComplete();
        }, 500);
      }
    };
    
    timeout = setTimeout(nextLine, 100);
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [onComplete]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  return (
    <div className="terminal-boot-container" onClick={onSkip}>
      {/* Fixed Top Header */}
      <div className="terminal-top-header">
        <h2 className="terminal-brand">
          <span className="matrix-title-glow">WELCOME TO THE MATRIX</span>
          <span className="matrix-subtitle">ANUJ'S PORTFOLIO LOADING SOON...</span>
        </h2>
      </div>

      {/* Boot Sequence Log Lines (Enters from ground and scrolls continuously) */}
      <div className="terminal-bottom-logs">
        <div className="terminal-lines">
          {lines.map((line, idx) => {
            if (!line) return null;
            return (
              <div key={idx} className={`term-line type-${line.type}`}>
                {line.text}
              </div>
            );
          })}
          {lines.length < bootSequence.length && <span className="term-cursor">_</span>}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
