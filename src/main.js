/* ==========================================================================
   MAIN APPLICATION BOOTSTRAP - SHARMILA & SHYAM APOLOGY WEBSITE
   ========================================================================== */

import { AmbientParticles } from './particles.js';
import { AudioManager } from './audio.js';
import { ForgivenessEngine } from './dodge.js';
import { FormHandler } from './form.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas Particles Engine
  new AmbientParticles('ambient-canvas');

  // 2. Initialize Audio Manager
  const audioManager = new AudioManager();

  // 3. Initialize Forgiveness & Dodge Engine
  new ForgivenessEngine();

  // 4. Initialize Form Handler
  new FormHandler();

  // 5. Hero Typewriter Effect
  initTypewriter();

  // 6. Interactive Flip Cards
  initFlipCards();

  // 7. Full Letter Modal Setup
  initLetterModal();
});

/* Hero Typewriter Animation */
function initTypewriter() {
  const target = document.getElementById('hero-typing-text');
  if (!target) return;

  const messages = [
    "Whenever you need me, I will be waiting for you always... My love is true.",
    "Your fear, your family, and your stress come first. I am here to protect your peace.",
    "A life without Sharmila isn't a life Shyam wants to live...",
    "No matter what happens, my heart belongs to you forever."
  ];

  let msgIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 70;

  function type() {
    const currentMsg = messages[msgIdx];

    if (isDeleting) {
      target.innerText = currentMsg.substring(0, charIdx - 1);
      charIdx--;
      typeSpeed = 35;
    } else {
      target.innerText = currentMsg.substring(0, charIdx + 1);
      charIdx++;
      typeSpeed = 70;
    }

    if (!isDeleting && charIdx === currentMsg.length) {
      isDeleting = true;
      typeSpeed = 2800; // Pause at full line
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      msgIdx = (msgIdx + 1) % messages.length;
      typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* Interactive Card Flip */
function initFlipCards() {
  const cards = document.querySelectorAll('.glass-card-interactive');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.classList.toggle('flipped');
      }
    });
  });
}

/* Full Letter Modal Setup */
function initLetterModal() {
  const openBtn = document.getElementById('open-letter-modal-btn');
  const letterModal = document.getElementById('letter-modal');
  const closeBtn = document.getElementById('close-letter-modal');
  const letterTarget = document.getElementById('full-letter-body-target');

  if (openBtn && letterModal && letterTarget) {
    openBtn.addEventListener('click', () => {
      const sourceLetter = document.querySelector('.letter-body');
      if (sourceLetter) {
        letterTarget.innerHTML = sourceLetter.innerHTML;
      }
      letterModal.classList.remove('hidden');
    });
  }

  if (closeBtn && letterModal) {
    closeBtn.addEventListener('click', () => {
      letterModal.classList.add('hidden');
    });
  }
}
