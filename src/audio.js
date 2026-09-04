/* ==========================================================================
   WEB AUDIO NIGHT CHANGES (ONE DIRECTION) ROMANTIC SONG PLAYER
   ========================================================================== */

export class AudioManager {
  constructor() {
    this.audioCtx = null;
    this.isPlayingSong = false;
    this.songInterval = null;
    this.songProgress = 0;
    this.songDuration = 226; // 3 minutes 46 seconds
    this.songTimer = null;

    this.musicToggleBtn = document.getElementById('music-toggle');
    this.playSongBtn = document.getElementById('play-song-btn');
    this.progressBar = document.getElementById('audio-progress-fill');
    this.timeDisplay = document.getElementById('audio-time-display');
    this.canvas = document.getElementById('audio-visualizer-canvas');
    
    this.initVisualizer();
    this.setupListeners();
  }

  initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setupListeners() {
    if (this.musicToggleBtn) {
      this.musicToggleBtn.addEventListener('click', () => this.toggleSong());
    }

    if (this.playSongBtn) {
      this.playSongBtn.addEventListener('click', () => this.toggleSong());
    }

    // Progress bar click seek
    if (this.progressBar && this.progressBar.parentElement) {
      this.progressBar.parentElement.addEventListener('click', (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        this.songProgress = percentage * this.songDuration;
        this.updateTimeUI();
      });
    }
  }

  /* Web Audio Oscillator Tone Generator for Night Changes melody */
  playNote(freq, duration = 0.5, type = 'sine', gainVal = 0.09) {
    if (!this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(gainVal, this.audioCtx.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch (e) {
      console.log('Audio note play error:', e);
    }
  }

  toggleSong() {
    this.initAudioContext();
    if (this.isPlayingSong) {
      this.pauseSong();
    } else {
      this.playSong();
    }
  }

  playSong() {
    this.isPlayingSong = true;
    document.body.classList.add('playing-song');

    if (this.musicToggleBtn) {
      this.musicToggleBtn.classList.remove('music-paused');
      this.musicToggleBtn.querySelector('.btn-text').innerText = 'Playing Night Changes 🎵';
    }

    if (this.playSongBtn) {
      this.playSongBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
    }

    // Night Changes Chorus Melody Notes Frequencies (D Major Key: D4, E4, F#4, G4, A4, B4, C#5, D5)
    const D4 = 293.66, E4 = 329.63, Fs4 = 369.99, G4 = 392.00, A4 = 440.00, B4 = 493.88, Cs5 = 554.37, D5 = 587.33;
    
    // Iconic Night Changes chorus melody sequence ("We're only getting older baby / And I've been thinking about it lately...")
    const nightChangesMelody = [
      // Chorus line 1: "We're only getting older, baby"
      { note: D4, duration: 0.6 }, { note: Fs4, duration: 0.6 }, { note: A4, duration: 0.6 }, { note: B4, duration: 0.8 }, { note: A4, duration: 0.6 }, { note: Fs4, duration: 0.6 }, { note: D4, duration: 1.0 },
      // Chorus line 2: "And I've been thinking about it lately"
      { note: Fs4, duration: 0.5 }, { note: G4, duration: 0.5 }, { note: A4, duration: 0.6 }, { note: A4, duration: 0.6 }, { note: A4, duration: 0.6 }, { note: Fs4, duration: 0.5 }, { note: E4, duration: 0.5 }, { note: D4, duration: 1.0 },
      // Chorus line 3: "Does it ever drive you crazy..."
      { note: D4, duration: 0.5 }, { note: Fs4, duration: 0.5 }, { note: A4, duration: 0.6 }, { note: B4, duration: 0.8 }, { note: A4, duration: 0.6 }, { note: Fs4, duration: 0.6 },
      // Chorus line 4: "It will never change me and you..."
      { note: D4, duration: 0.6 }, { note: E4, duration: 0.6 }, { note: Fs4, duration: 0.8 }, { note: Fs4, duration: 0.6 }, { note: E4, duration: 0.6 }, { note: D4, duration: 1.4 }
    ];

    // Chords backing track (D Major, Bm, G, A)
    const chords = [
      [D4, Fs4, A4], // D Major
      [B4/2, D4, Fs4], // Bm
      [G4/2, B4, D4], // G
      [A4/2, Cs5, E4]  // A
    ];

    let noteIdx = 0;
    let chordIdx = 0;

    const playStep = () => {
      if (!this.isPlayingSong) return;

      // Play backing chord every 4 steps
      if (noteIdx % 4 === 0) {
        const currentChord = chords[chordIdx];
        currentChord.forEach(f => this.playNote(f, 2.8, 'triangle', 0.05));
        chordIdx = (chordIdx + 1) % chords.length;
      }

      // Play Night Changes lead melody note
      const currentNote = nightChangesMelody[noteIdx];
      this.playNote(currentNote.note, currentNote.duration, 'sine', 0.1);

      noteIdx = (noteIdx + 1) % nightChangesMelody.length;
    };

    playStep();
    this.songInterval = setInterval(playStep, 500);

    // Progress timer tick
    this.songTimer = setInterval(() => {
      this.songProgress += 1;
      this.updateTimeUI();

      if (this.songProgress >= this.songDuration) {
        this.resetSong();
      }
    }, 1000);
  }

  pauseSong() {
    this.isPlayingSong = false;
    document.body.classList.remove('playing-song');

    if (this.songInterval) clearInterval(this.songInterval);
    if (this.songTimer) clearInterval(this.songTimer);

    if (this.musicToggleBtn) {
      this.musicToggleBtn.classList.add('music-paused');
      this.musicToggleBtn.querySelector('.btn-text').innerText = 'Night Changes 🎵';
    }

    if (this.playSongBtn) {
      this.playSongBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    }
  }

  resetSong() {
    this.pauseSong();
    this.songProgress = 0;
    this.updateTimeUI();
  }

  updateTimeUI() {
    const percentage = (this.songProgress / this.songDuration) * 100;
    if (this.progressBar) this.progressBar.style.width = `${percentage}%`;

    const mins = Math.floor(this.songProgress / 60);
    const secs = Math.floor(this.songProgress % 60).toString().padStart(2, '0');
    if (this.timeDisplay) this.timeDisplay.innerText = `${mins}:${secs} / 3:46`;
  }

  /* Animated Visualizer Canvas */
  initVisualizer() {
    if (!this.canvas) return;
    const ctx = this.canvas.getContext('2d');
    let bars = 44;

    const render = () => {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const barWidth = this.canvas.width / bars;

      for (let i = 0; i < bars; i++) {
        let height = 8;
        if (this.isPlayingSong) {
          height = Math.sin(Date.now() * 0.006 + i * 0.25) * 24 + 26;
        } else {
          height = Math.sin(Date.now() * 0.002 + i * 0.2) * 4 + 8;
        }

        const x = i * barWidth;
        const y = (this.canvas.height - height) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + height);
        grad.addColorStop(0, '#ff4d8d');
        grad.addColorStop(0.5, '#ffd1dc');
        grad.addColorStop(1, '#e5b869');

        ctx.fillStyle = grad;
        ctx.fillRect(x + 2, y, barWidth - 4, height);
      }
      requestAnimationFrame(render);
    };
    render();
  }
}
