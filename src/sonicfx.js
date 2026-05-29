/**
 * SonicFX - A lightweight Web Audio API Sound Effects Framework
 * @version 1.1.0 (With Centralized Mute & Event Dispatching)
 * @author Experienced JS Dev
 * @license MIT
 */
const SonicFX = (() => {
  let audioCtx = null;
  let isMuted = false; // Central mute state

  // Initialize AudioContext lazily on user gesture
  const init = () => {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  };

  // Helper to create a standard oscillator-gain chain
  const createChain = (type, startFreq, duration, volume = 0.1) => {
    // Short-circuit immediately if muted
    if (isMuted) {
      console.warn( "Is muted. Can't play sound." );
      return null;
    }
    
    const ctx = init();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(volume, ctx.currentTime);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    return { ctx, osc, gainNode };
  };

  return {
    /**
     * Core Volume / Mute Controls
     */
    toggleMute() {
      isMuted = !isMuted;
      
      // Dispatch a global event for UI elements to listen to
      const event = new CustomEvent('sonicfx-mute-toggle', { 
        detail: { isMuted: isMuted } 
      });
      window.dispatchEvent(event);
      
      return isMuted;
    },

    setMute(state) {
      if (isMuted !== state) {
        this.toggleMute();
      }
    },

    getMutedState() {
      return isMuted;
    },

    /**
     * UI & Notification Tones
     */
    success() {
      const chain = createChain('sine', 523.25, 0.3, 0.1); // C5
      if (!chain) return;
      const { ctx, osc, gainNode } = chain;
      
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    },

    error() {
      const chain = createChain('triangle', 130.81, 0.3, 0.15); // C3
      if (!chain) return;
      const { ctx, osc, gainNode } = chain;
      
      osc.frequency.setValueAtTime(130.81, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(85, ctx.currentTime + 0.25);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.01, ctx.currentTime + 0.12);
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime + 0.13);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.3);
    },

    warning() {
      const chain = createChain('triangle', 392.00, 0.4, 0.15); // G4
      if (!chain) return;
      const { ctx, osc, gainNode } = chain;
      
      osc.frequency.setValueAtTime(392.00, ctx.currentTime);
      osc.frequency.setValueAtTime(349.23, ctx.currentTime + 0.15); // F4
      osc.frequency.setValueAtTime(392.00, ctx.currentTime + 0.3);
      
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    },

    info() {
      const chain = createChain('sine', 440.00, 0.15, 0.08); // A4
      if (!chain) return;
      const { ctx, osc, gainNode } = chain;
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    },

    click() {
      const chain = createChain('sine', 800, 0.05, 0.05);
      if (!chain) return;
      const { ctx, osc, gainNode } = chain;
      
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    },

    /**
     * Game & Advanced Interaction Tones
     */
    celebration() {
      if (isMuted) return;
      const ctx = init();
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 392.00 * 2, 523.25 * 2]; // C5, E5, G5, C6
      
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + (index * 0.06));
        
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.setValueAtTime(0.08, now + (index * 0.06));
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5 + (index * 0.06));
        
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        osc.start(now + (index * 0.06));
        osc.stop(now + 0.5 + (index * 0.06));
      });
    },

    levelUp() {
      const chain = createChain('sine', 261.63, 0.6, 0.1);
      if (!chain) return;
      const { ctx, osc, gainNode } = chain;
      
      osc.frequency.setValueAtTime(261.63, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.4);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.6);
    },

    laser() {
      const chain = createChain('triangle', 1200, 0.2, 0.1);
      if (!chain) return;
      const { ctx, osc, gainNode } = chain;
      
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.18);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    },

    powerUp() {
      const chain = createChain('triangle', 150, 0.4, 0.1);
      if (!chain) return;
      const { ctx, osc, gainNode } = chain;
      const now = ctx.currentTime;
      
      for (let i = 0; i < 6; i++) {
        osc.frequency.setValueAtTime(150 + (i * 120), now + (i * 0.06));
      }
      
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      
      osc.start(now);
      osc.stop(now + 0.4);
    },

    unlock() {
      const chain = createChain('sine', 440, 0.35, 0.08);
      if (!chain) return;
      const { ctx, osc, gainNode } = chain;
      
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(450, ctx.currentTime + 0.2);
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    }
  };
})();