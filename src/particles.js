/* ==========================================================================
   AMBIENT CANVAS PARTICLE & FLOATING HEARTS SYSTEM
   ========================================================================== */

export class AmbientParticles {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null, radius: 120 };
    this.maxParticles = 60;
    
    this.init();
    this.animate();

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  init() {
    this.resize();
    this.particles = [];
    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push(this.createParticle());
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    const isHeart = Math.random() < 0.35;
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height + this.canvas.height,
      size: Math.random() * (isHeart ? 14 : 4) + 2,
      speedY: -(Math.random() * 0.8 + 0.3),
      speedX: Math.sin(Math.random() * Math.PI) * 0.4,
      opacity: Math.random() * 0.6 + 0.2,
      isHeart: isHeart,
      pulse: Math.random() * Math.PI,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      color: Math.random() < 0.5 ? '#ff4d8d' : (Math.random() < 0.5 ? '#ff9ebb' : '#e5b869')
    };
  }

  drawHeart(x, y, size, color, opacity) {
    this.ctx.save();
    this.ctx.translate(x, y);
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    const d = size;
    this.ctx.moveTo(0, 0);
    this.ctx.bezierCurveTo(-d / 2, -d / 2, -d, d / 3, 0, d);
    this.ctx.bezierCurveTo(d, d / 3, d / 2, -d / 2, 0, 0);
    this.ctx.fill();
    this.ctx.restore();
  }

  drawCircle(x, y, size, color, opacity) {
    this.ctx.save();
    this.ctx.globalAlpha = opacity;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Subtle outer glow
    this.ctx.shadowBlur = 10;
    this.ctx.shadowColor = color;
    this.ctx.fill();
    this.ctx.restore();
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];

      p.y += p.speedY;
      p.x += Math.sin(p.pulse) * 0.3;
      p.pulse += p.pulseSpeed;

      // Mouse repulsion/attraction gentle force
      if (this.mouse.x && this.mouse.y) {
        let dx = this.mouse.x - p.x;
        let dy = this.mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          p.x -= (dx / dist) * 1.2;
          p.y -= (dy / dist) * 1.2;
        }
      }

      // Reset when particle drifts off screen top
      if (p.y < -20) {
        this.particles[i] = this.createParticle();
        this.particles[i].y = this.canvas.height + 20;
      }

      if (p.isHeart) {
        this.drawHeart(p.x, p.y, p.size, p.color, p.opacity);
      } else {
        this.drawCircle(p.x, p.y, p.size, p.color, p.opacity);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}
