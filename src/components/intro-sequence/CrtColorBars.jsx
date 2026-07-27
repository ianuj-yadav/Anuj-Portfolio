import React from 'react';
import './intro.css';

export default function CrtColorBars({ onSkip }) {
  return (
    <div className="crt-color-bars" onClick={onSkip}>
      <div className="smpte-bars" style={{ display: 'flex', width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
        <div style={{ flex: 1, height: '100%', backgroundColor: '#EBEBEB' }}></div>
        <div style={{ flex: 1, height: '100%', backgroundColor: '#C3C321' }}></div>
        <div style={{ flex: 1, height: '100%', backgroundColor: '#21C3C3' }}></div>
        <div style={{ flex: 1, height: '100%', backgroundColor: '#21C321' }}></div>
        <div style={{ flex: 1, height: '100%', backgroundColor: '#C321C3' }}></div>
        <div style={{ flex: 1, height: '100%', backgroundColor: '#C32121' }}></div>
        <div style={{ flex: 1, height: '100%', backgroundColor: '#2121C3' }}></div>
      </div>
      <div className="stream-starting-text">
        <div className="glitch-wrapper">
          <h1 className="glitch-text" data-text="WELCOME">WELCOME</h1>
        </div>
        <p className="crt-subtitle">SYSTEM IS LOADING</p>
        <p className="skip-hint">PRESS SPACE OR ESC TO SKIP</p>
      </div>
      <div className="tv-noise"></div>
    </div>
  );
}
