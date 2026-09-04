/* ==========================================================================
   FORM RESPONSE & GMAIL DELIVERY MODULE (10439shyamsuresh@gmail.com)
   ========================================================================== */

export class FormHandler {
  constructor() {
    this.form = document.getElementById('sharmila-response-form');
    this.statusMsg = document.getElementById('form-status-msg');
    this.submitBtn = document.getElementById('submit-response-btn');
    this.viewLogBtn = document.getElementById('view-local-messages-btn');
    this.logModal = document.getElementById('messages-log-modal');
    this.closeLogModalBtn = document.getElementById('close-log-modal');
    this.messagesContainer = document.getElementById('messages-list-container');

    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (this.viewLogBtn) {
      this.viewLogBtn.addEventListener('click', () => this.openLogModal());
    }

    if (this.closeLogModalBtn) {
      this.closeLogModalBtn.addEventListener('click', () => {
        if (this.logModal) this.logModal.classList.add('hidden');
      });
    }
  }

  async handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(this.form);
    const name = formData.get('name') || 'Sharmila';
    const emotion = formData.get('emotion') || 'I forgive you 💖';
    const message = formData.get('message') || '';

    // UI Loading state
    if (this.submitBtn) {
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending To Shyam...</span>';
    }

    // Save to local storage log immediately
    this.saveToLocalStorage({
      name,
      emotion,
      message,
      date: new Date().toLocaleString()
    });

    try {
      // 1. Submit via Web3Forms endpoint
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success || response.ok) {
        this.showStatus('success', '💖 Thank you Sharmila! Your message has been delivered directly to Shyam\'s Gmail (10439shyamsuresh@gmail.com).');
        this.form.reset();
      } else {
        // Fallback option
        this.handleFallbackMailto(name, emotion, message);
      }
    } catch (err) {
      console.log('Web3Forms fetch error:', err);
      // Fallback option
      this.handleFallbackMailto(name, emotion, message);
    } finally {
      if (this.submitBtn) {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message To Shyam\'s Gmail</span>';
      }
    }
  }

  handleFallbackMailto(name, emotion, message) {
    const subject = encodeURIComponent(`💖 Message from Sharmila: ${emotion}`);
    const body = encodeURIComponent(`From: ${name}\nStatus: ${emotion}\n\nMessage:\n${message}\n\n---\nSent via Apology Website for Sharmila`);
    const mailtoUrl = `mailto:10439shyamsuresh@gmail.com?subject=${subject}&body=${body}`;

    this.showStatus('success', '💖 Message saved! Opening your email app to send directly to 10439shyamsuresh@gmail.com...');
    
    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 800);
  }

  showStatus(type, text) {
    if (!this.statusMsg) return;
    this.statusMsg.className = `form-status ${type}`;
    this.statusMsg.innerHTML = text;
  }

  saveToLocalStorage(entry) {
    try {
      const existing = JSON.parse(localStorage.getItem('sharmila_apology_messages') || '[]');
      existing.unshift(entry);
      localStorage.setItem('sharmila_apology_messages', JSON.stringify(existing));
    } catch (e) {
      console.log('Local storage save error:', e);
    }
  }

  openLogModal() {
    if (!this.logModal || !this.messagesContainer) return;

    try {
      const messages = JSON.parse(localStorage.getItem('sharmila_apology_messages') || '[]');
      if (messages.length === 0) {
        this.messagesContainer.innerHTML = '<p class="text-center text-muted">No messages saved in log yet.</p>';
      } else {
        this.messagesContainer.innerHTML = messages.map(msg => `
          <div class="message-log-item">
            <div class="log-meta">
              <span><strong>${msg.name}</strong> (${msg.emotion})</span>
              <span>${msg.date}</span>
            </div>
            <div class="log-text">${msg.message}</div>
          </div>
        `).join('');
      }
    } catch (e) {
      this.messagesContainer.innerHTML = '<p class="text-center text-muted">Error reading log history.</p>';
    }

    this.logModal.classList.remove('hidden');
  }
}
