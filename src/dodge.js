/* ==========================================================================
   INTERACTIVE DODGE BUTTON & CONFETTI CELEBRATION
   ========================================================================== */

import confetti from 'canvas-confetti';

export class ForgivenessEngine {
  constructor() {
    this.yesBtn = document.getElementById('yes-btn');
    this.noBtn = document.getElementById('no-btn');
    this.noBtnText = document.getElementById('no-btn-text');
    this.container = document.getElementById('button-dodge-container');
    this.yesModal = document.getElementById('yes-modal');
    this.closeYesModalBtn = document.getElementById('close-yes-modal');

    this.dodgeCount = 0;
    this.phrases = [
      "No...",
      "Are you sure? 🥺",
      "Think again? 💖",
      "Give me 1 sec! 🌹",
      "You can't catch me! 😜",
      "Shyam loves you too much! 💕",
      "Try clicking YES instead? 🥰",
      "Okay, maybe YES? 💖"
    ];

    this.init();
  }

  init() {
    if (this.yesBtn) {
      this.yesBtn.addEventListener('click', () => this.handleYesClick());
    }

    if (this.noBtn) {
      // Hover & Mousemove distance physics dodge
      this.noBtn.addEventListener('mouseenter', () => this.dodgeButton());
      this.noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.dodgeButton();
      });

      // Desktop proximity dodge calculation
      window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    if (this.closeYesModalBtn) {
      this.closeYesModalBtn.addEventListener('click', () => {
        if (this.yesModal) this.yesModal.classList.add('hidden');
      });
    }
  }

  handleMouseMove(e) {
    if (!this.noBtn || !this.container) return;

    const rect = this.noBtn.getBoundingClientRect();
    const btnCenterX = rect.left + rect.width / 2;
    const btnCenterY = rect.top + rect.height / 2;

    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const distance = Math.hypot(dx, dy);

    // Proximity threshold of 90px triggers dodge
    if (distance < 90) {
      this.dodgeButton(dx, dy);
    }
  }

  dodgeButton(dx = 0, dy = 0) {
    this.dodgeCount++;

    // Update text sequentially
    const nextPhrase = this.phrases[Math.min(this.dodgeCount, this.phrases.length - 1)];
    if (this.noBtnText) {
      this.noBtnText.innerText = nextPhrase;
    }

    // If dodge count reaches max phrase, transform 'No' into 'Yes' helper
    if (this.dodgeCount >= this.phrases.length - 1) {
      this.noBtn.style.background = 'linear-gradient(135deg, #ff7aa8, #ff4d8d)';
      this.noBtn.style.color = '#fff';
      this.noBtn.onclick = () => this.handleYesClick();
    }

    // Calculate boundary bounds inside container or screen viewport
    const containerRect = this.container ? this.container.getBoundingClientRect() : { width: 300, height: 100 };
    const maxX = containerRect.width / 2 - 60;
    const maxY = 60;

    let randomX = (Math.random() - 0.5) * maxX * 2;
    let randomY = (Math.random() - 0.5) * maxY * 2;

    // Push away from cursor direction if dx/dy provided
    if (dx !== 0 || dy !== 0) {
      const angle = Math.atan2(dy, dx);
      randomX = -Math.cos(angle) * (maxX * 0.8);
      randomY = -Math.sin(angle) * (maxY * 0.8);
    }

    this.noBtn.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.95)`;
  }

  handleYesClick() {
    // 1. Confetti & Heart Fireworks Burst
    this.triggerConfetti();

    // 2. Open Success Modal
    if (this.yesModal) {
      this.yesModal.classList.remove('hidden');
    }
  }

  triggerConfetti() {
    // Primary burst of heart shapes & rose gold ribbons
    const count = 200;
    const defaults = {
      origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#ff4d8d', '#ff9ebb', '#e5b869']
    });

    fire(0.2, {
      spread: 60,
      colors: ['#ffd1dc', '#ffffff', '#ff3377']
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      colors: ['#e5b869', '#ffd1dc']
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }
}
