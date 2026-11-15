const phrases = ['AI agents', 'n8n automations', 'digital products', 'useful experiences'];
let phraseIndex = 0;
const typedText = document.getElementById('typed-text');
setInterval(() => {
  phraseIndex = (phraseIndex + 1) % phrases.length;
  typedText.animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 380 });
  typedText.textContent = phrases[phraseIndex];
}, 2200);

document.getElementById('year').textContent = new Date().getFullYear();
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const output = document.getElementById('demo-output');
document.getElementById('generate-button').addEventListener('click', () => {
  const idea = document.getElementById('idea-input').value.trim();
  if (!idea) {
    output.textContent = 'Add a short idea above and I’ll shape it into a starter prompt.';
    document.getElementById('idea-input').focus();
    return;
  }
  output.textContent = `Act as a thoughtful AI product designer. Help me plan: “${idea}”\n\nStart by asking up to 3 clarifying questions. Then suggest a simple first version, the key steps to build it, and one way to measure whether it works. Keep the advice practical and beginner-friendly.`;
});

let toastTimer;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
}
document.querySelectorAll('.product-button').forEach(button => button.addEventListener('click', () => {
  const name = button.dataset.product;
  if (name === 'AI Prompt Starter Pack') {
    const content = 'AI PROMPT STARTER PACK\n\n1. Be clear about the goal.\n2. Share relevant context and constraints.\n3. Describe the format you want back.\n4. Ask the AI to clarify missing information.\n5. Iterate: review, refine, and verify.\n\nStarter template:\n“You are [role]. Help me [goal]. Context: [details]. Please return [format] and ask questions if anything important is missing.”';
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'ai-prompt-starter-pack.txt';
    link.click();
    URL.revokeObjectURL(link.href);
    showToast('Your free prompt pack is downloading.');
  } else {
    showToast(`${name} is coming soon — check back for updates!`);
  }
}));

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let pointer = { x: -1000, y: -1000 };
function sizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = 760 * dpr;
  canvas.style.height = '760px';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const count = Math.min(75, Math.floor(window.innerWidth / 17));
  particles = Array.from({ length: count }, () => ({ x: Math.random() * window.innerWidth, y: Math.random() * 760, vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22, r: Math.random() * 1.4 + .5 }));
}
window.addEventListener('resize', sizeCanvas);
window.addEventListener('pointermove', event => { pointer = { x: event.clientX, y: event.clientY }; });
sizeCanvas();
function drawParticles() {
  ctx.clearRect(0, 0, window.innerWidth, 760);
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
      if (p.y < 0 || p.y > 760) p.vy *= -1;
    }
    const distance = Math.hypot(p.x - pointer.x, p.y - pointer.y);
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r + (distance < 110 ? 1 : 0), 0, Math.PI * 2);
    ctx.fillStyle = distance < 110 ? 'rgba(164,242,107,.8)' : 'rgba(112,201,194,.48)'; ctx.fill();
    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j]; const d = Math.hypot(p.x - q.x, p.y - q.y);
      if (d < 95) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(94,177,169,${(1 - d / 95) * .11})`; ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}
