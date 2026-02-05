// Interactive single-scroll animated site
document.addEventListener('DOMContentLoaded', ()=>{

  // Elements
  const sections = document.querySelectorAll('.section');
  const playBtn = document.getElementById('play-music');
  const muteBtn = document.getElementById('mute-toggle');
  const audio = document.getElementById('bg-audio');
  const confettiCanvas = document.getElementById('confetti');
  const cookieButtons = document.querySelectorAll('.cookie');
  const cookieCountEl = document.getElementById('cookie-count');
  const openLetterBtn = document.getElementById('open-letter');
  const letterEl = document.getElementById('letter');
  const celebrateBtn = document.getElementById('celebrate-btn');
  const replayBtn = document.getElementById('replay');

  let cookieCount = 0;
  let muted = false;

  // Play button behavior (user requested Play Button)
  playBtn.addEventListener('click', ()=>{
    audio.play().catch(()=>{ /* autoplay blocked until user interacts */ });
    playBtn.textContent = 'Playing ▶️';
  });
  muteBtn.addEventListener('click', ()=> {
    muted = !muted; audio.muted = muted;
    muteBtn.textContent = muted ? '🔇' : '🔈';
  });

  // Simple reveal on scroll using IntersectionObserver
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        // small confetti for first reveal on hero
        if(entry.target.id === 'sec-1') setTimeout(()=> burstConfetti(80), 400);
      }
    });
  }, {threshold: 0.25});
  sections.forEach(s=> io.observe(s));

  // Cookie clicks
  cookieButtons.forEach(btn=>{
    btn.addEventListener('click', ()=> {
      cookieCount++; cookieCountEl.textContent = cookieCount;
      btn.animate([{transform:'scale(1)'},{transform:'scale(1.2)'},{transform:'scale(1)'}], {duration:280});
      if(cookieCount === 3){
        setTimeout(()=> alert("You collected 3 cookies! Delilah winks at you 😄"), 250);
      }
    });
  });

  // Open letter scroll to section 8 and start typewriter
  openLetterBtn.addEventListener('click', ()=> {
    document.getElementById('sec-8').scrollIntoView({behavior:'smooth'});
    setTimeout(()=> startTypewriter(), 700);
  });

  // celebrate btn
  celebrateBtn.addEventListener('click', ()=> {
    burstConfetti(140);
  });

  // replay: scroll to top and reset letter
  replayBtn?.addEventListener('click', ()=> {
    window.scrollTo({top:0, behavior:'smooth'});
    letterEl.textContent = '';
  });

  // Typewriter
  const letterText = `Dear Kimmy 💙

Hiiiii Kimmmmyyyy........ Happyyyy 18th Birthday!

Eighteen is a special door — step through it with your sketches in your pocket, cookies in hand, and Delilah by your side.
May your lines get braver, your laughter louder, and your dreams closer.

Keep being kind, playful and wonderfully you.

With love,
— Abdullah ✨
`;
  function startTypewriter(){
    letterEl.textContent = '';
    let i = 0;
    function step(){
      if(i <= letterText.length){
        letterEl.textContent = letterText.slice(0, i++);
        setTimeout(step, 18 + Math.random()*18);
      }
    }
    step();
  }

  // Download note
  document.getElementById('download-note')?.addEventListener('click', ()=>{
    const blob = new Blob([letterText], {type:'text/plain'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'Happy_18th_Kimmy.txt';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // Simple confetti (canvas)
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
  const ctx = confettiCanvas.getContext('2d');
  let confetti = [];
  function rand(min,max){ return Math.random()*(max-min)+min }
  function spawn(n){
    for(let i=0;i<n;i++){
      confetti.push({
        x: rand(0, confettiCanvas.width),
        y: rand(-200, -20),
        vx: rand(-1.5,1.5),
        vy: rand(1,4),
        size: rand(6,12),
        color: `hsl(${rand(190,220)},80%,60%)`,
        rot: rand(0,360),
        spin: rand(-0.2,0.4)
      });
    }
    if(confetti.length && !running) run();
  }
  function burstConfetti(n=80){ spawn(n) }
  let running = false;
  function run(){
    running = true;
    let frames = 0;
    function loop(){
      frames++;
      ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
      confetti.forEach((p, idx)=>{
        p.x += p.vx; p.y += p.vy; p.vy += 0.03; p.rot += p.spin;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
        ctx.restore();
        if(p.y > confettiCanvas.height + 50) confetti.splice(idx,1);
      });
      if(confetti.length && frames < 1000) requestAnimationFrame(loop);
      else { running = false; ctx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height); confetti = []; }
    }
    loop();
  }
  // resize canvas
  window.addEventListener('resize', ()=> {
    confettiCanvas.width = window.innerWidth; confettiCanvas.height = window.innerHeight;
  });

  // Butterflies following cursor (creates small DOM butterflies)
  let butterflies = [];
  const colors = ['#8ed0ff','#bfe9ff','#9ad4ff'];
  function createButterfly() {
    const el = document.createElement('div');
    el.className = 'butterfly';
    el.style.background = `radial-gradient(circle at 30% 30%, ${colors[Math.floor(Math.random()*colors.length)]}, transparent 40%)`;
    document.body.appendChild(el);
    butterflies.push({el, life: 120 + Math.random()*80, vx:0, vy:0});
    if(butterflies.length > 18){
      const old = butterflies.shift();
      old.el.remove();
    }
  }
  document.addEventListener('mousemove', (e)=>{
    // create occasional butterflies
    if(Math.random() > 0.85) createButterfly();
    butterflies.forEach((b, i)=>{
      const dx = (e.clientX + (Math.random()*40-20)) - parseFloat(b.el.style.left || e.clientX+'px');
      const dy = (e.clientY + (Math.random()*40-20)) - parseFloat(b.el.style.top || e.clientY+'px');
      b.vx += dx*0.02; b.vy += dy*0.02;
      b.vx *= 0.86; b.vy *= 0.86;
      let x = (parseFloat(b.el.style.left || e.clientX+'px') || e.clientX) + b.vx;
      let y = (parseFloat(b.el.style.top || e.clientY+'px') || e.clientY) + b.vy;
      b.el.style.left = x + 'px'; b.el.style.top = y + 'px';
      b.el.style.transform = `rotate(${Math.atan2(b.vy,b.vx)*30}deg)`;
      b.life--;
      if(b.life < 0){ b.el.remove(); butterflies.splice(i,1); }
    });
  });

  // Cursor parallax for background layers
  const layers = document.querySelectorAll('.bg-layer');
  document.addEventListener('mousemove', (e)=>{
    const cx = (e.clientX / window.innerWidth - 0.5);
    const cy = (e.clientY / window.innerHeight - 0.5);
    layers.forEach((ly, i)=> {
      const f = (i+1) * 8;
      ly.style.transform = `translate3d(${cx*f}px, ${cy*f}px, 0) scale(${1 + i*0.02})`;
    });
  });

  // small floating animations for visible sections
  setInterval(()=> {
    document.querySelectorAll('.section.show .sketch-blob, .section.show .chibi').forEach(el=>{
      if(el) el.animate([{transform:'translateY(0)'},{transform:'translateY(-6px)'},{transform:'translateY(0)'}], {duration:1400, iterations:1});
    });
  }, 3200);

  // simple mini-game start (just playful)
  document.getElementById('game-start')?.addEventListener('click', ()=>{
    alert('Mini-game: Pretend you played and won! 🏆');
  });

});
