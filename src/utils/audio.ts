/**
 * Web Audio API synthesizer for 2048 Infinity.
 * Synthesizes dynamic sound effects without external audio assets.
 */

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  public muted: boolean = false;

  constructor() {
    const savedMuted = localStorage.getItem('2048_infinity_muted');
    if (savedMuted !== null) {
      this.muted = savedMuted === 'true';
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    localStorage.setItem('2048_infinity_muted', String(this.muted));
    return this.muted;
  }

  private triggerHaptic(pattern: number | number[]) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator && !this.muted) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore haptic errors on unsupported devices
      }
    }
  }

  public playMove() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
      this.triggerHaptic(8);
    } catch {
      // Audio context error handling
    }
  }

  public playMerge(tileValue: number) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Calculate pitch scaling with tile value
      const baseFreq = 240;
      const power = Math.min(14, Math.log2(Math.max(2, tileValue)));
      const freq = baseFreq * Math.pow(1.08, power);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.09);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
      this.triggerHaptic(18);
    } catch {
      // Audio context error handling
    }
  }

  public playSpecial(type: '2x' | 'bomb' | 'wild') {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      if (type === 'bomb') {
        // Low rumble explosion sound with filtered noise buffer
        const bufferSize = this.ctx.sampleRate * 0.3;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(40, now + 0.28);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.3);
        this.triggerHaptic([30, 40, 70]);
      } else if (type === '2x') {
        // Bright energetic arpeggio
        const notes = [440, 659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const t = now + idx * 0.05;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0.12, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(t);
          osc.stop(t + 0.1);
        });
        this.triggerHaptic([15, 20, 30]);
      } else if (type === 'wild') {
        // Celestial shimmer with pitch slide
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const t = now + idx * 0.04;

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, t + 0.14);

          gain.gain.setValueAtTime(0.1, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(t);
          osc.stop(t + 0.14);
        });
        this.triggerHaptic([20, 20, 20]);
      }
    } catch {
      // Audio context error handling
    }
  }

  public playMilestone() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const chords = [
        [523.25, 659.25, 783.99],       // C major
        [587.33, 739.99, 880.00],       // D major
        [659.25, 830.61, 987.77],       // E major
        [1046.5, 1318.5, 1567.98]       // High C octave
      ];

      chords.forEach((chord, chordIdx) => {
        const time = this.ctx!.currentTime + chordIdx * 0.14;
        chord.forEach((freq) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();

          osc.type = chordIdx === 3 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, time);

          gain.gain.setValueAtTime(0.12, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

          osc.connect(gain);
          gain.connect(this.ctx!.destination);

          osc.start(time);
          osc.stop(time + 0.35);
        });
      });
      this.triggerHaptic([50, 40, 80, 40, 120]);
    } catch {
      // Audio context error handling
    }
  }

  public playGameOver() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const notes = [329.63, 293.66, 261.63, 196.0];
      notes.forEach((freq, idx) => {
        const t = this.ctx!.currentTime + idx * 0.15;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(t);
        osc.stop(t + 0.2);
      });
      this.triggerHaptic([40, 60, 80]);
    } catch {
      // Audio context error handling
    }
  }
}

export const soundManager = new SoundSynthesizer();
