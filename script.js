// Mobile nav toggle
const navToggle = document.querySelector('.navtoggle');
const navLinks = document.querySelector('.navlinks');
if(navToggle){
  navToggle.addEventListener('click', ()=>{
    navLinks.classList.toggle('open');
    navToggle.textContent = navLinks.classList.contains('open') ? '×' : '≡';
  });
  navLinks.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', ()=>{
      navLinks.classList.remove('open');
      navToggle.textContent = '≡';
    });
  });
}

// Footer year
const yearEl = document.getElementById('year');
if(yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal on scroll
const revealEls = document.querySelectorAll('[data-reveal]');
if('IntersectionObserver' in window && revealEls.length){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.opacity = 1;
        e.target.style.transform = 'translateY(0)';
        io.unobserve(e.target);
      }
    });
  }, {threshold:0.12});
  revealEls.forEach(el=>{
    el.style.opacity = 0;
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    io.observe(el);
  });
}

// ---------- Network canvas (hero signature element) ----------
const canvas = document.getElementById('netcanvas');
if(canvas){
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w, h, nodes = [], packets = [];
  const NODE_COUNT = 26;
  const LINK_DIST = 150;

  function resize(){
    const rect = canvas.getBoundingClientRect();
    w = canvas.width = rect.width * devicePixelRatio;
    h = canvas.height = rect.height * devicePixelRatio;
  }

  function initNodes(){
    nodes = [];
    for(let i=0;i<NODE_COUNT;i++){
      nodes.push({
        x: Math.random()*w,
        y: Math.random()*h,
        vx: (Math.random()-0.5)*0.25*devicePixelRatio,
        vy: (Math.random()-0.5)*0.25*devicePixelRatio,
        r: (Math.random()*1.6+1.4)*devicePixelRatio
      });
    }
  }

  function spawnPacket(){
    if(nodes.length < 2) return;
    const a = nodes[Math.floor(Math.random()*nodes.length)];
    let b = nodes[Math.floor(Math.random()*nodes.length)];
    let tries=0;
    while(b===a && tries<5){ b = nodes[Math.floor(Math.random()*nodes.length)]; tries++; }
    packets.push({a, b, t:0, speed: 0.006 + Math.random()*0.004});
  }

  function draw(){
    ctx.clearRect(0,0,w,h);

    // links
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx = nodes[i].x-nodes[j].x, dy = nodes[i].y-nodes[j].y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        const maxDist = LINK_DIST*devicePixelRatio;
        if(dist < maxDist){
          ctx.strokeStyle = `rgba(63,230,220,${(1-dist/maxDist)*0.22})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // nodes
    nodes.forEach(n=>{
      ctx.fillStyle = 'rgba(233,241,246,0.55)';
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fill();
      if(!reduceMotion){
        n.x += n.vx; n.y += n.vy;
        if(n.x < 0 || n.x > w) n.vx *= -1;
        if(n.y < 0 || n.y > h) n.vy *= -1;
      }
    });

    // packets
    packets = packets.filter(p => p.t <= 1);
    packets.forEach(p=>{
      const x = p.a.x + (p.b.x - p.a.x)*p.t;
      const y = p.a.y + (p.b.y - p.a.y)*p.t;
      ctx.fillStyle = '#ffb648';
      ctx.shadowColor = '#ffb648';
      ctx.shadowBlur = 8*devicePixelRatio;
      ctx.beginPath();
      ctx.arc(x, y, 2.4*devicePixelRatio, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;
      if(!reduceMotion) p.t += p.speed;
    });

    if(!reduceMotion) requestAnimationFrame(draw);
  }

  resize();
  initNodes();
  draw();
  if(!reduceMotion){
    setInterval(spawnPacket, 700);
  } else {
    for(let i=0;i<4;i++) spawnPacket();
  }
  window.addEventListener('resize', ()=>{ resize(); initNodes(); if(reduceMotion) draw(); });
}

// Contact form (front-end only demo)
const contactForm = document.getElementById('contact-form');
if(contactForm){
  contactForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('name').value || 'there';
    const status = document.getElementById('form-status');
    status.textContent = `Thanks, ${name}. This form is a front-end demo — for now, please email info@konsitech.com or call +260 967 7378049 directly.`;
    status.style.display = 'block';
    contactForm.reset();
  });
}
