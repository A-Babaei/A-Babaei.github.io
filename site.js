
(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('scrollProgress');
  const header = document.querySelector('.site-header');
  const menu = document.querySelector('.nav-list');
  const menuToggle = document.querySelector('.menu-toggle');

  function updateScroll(){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if(progress) progress.style.width = `${Math.max(0, Math.min(100, pct))}%`;
    if(header) header.classList.toggle('compact', window.scrollY > 40);
  }
  addEventListener('scroll', updateScroll, {passive:true}); updateScroll();

  if(menuToggle && menu){
    menuToggle.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {menu.classList.remove('open');menuToggle.setAttribute('aria-expanded','false')}));
  }

  document.getElementById('year')?.append(String(new Date().getFullYear()));
  document.querySelector('.print-button')?.addEventListener('click', () => print());

  const reveal = document.querySelectorAll('.reveal');
  if(reducedMotion || !('IntersectionObserver' in window)) reveal.forEach(el => el.classList.add('visible'));
  else {
    const observer = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}), {threshold:.12,rootMargin:'0px 0px -40px'});
    reveal.forEach(el => observer.observe(el));
  }

  initCursor(reducedMotion);
  initCanvases(reducedMotion);
  initMotionLab();

  function initCursor(disabled){
    if(disabled || !matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    document.body.classList.add('cursor-enabled');
    const dot = document.querySelector('.cursor-dot'); const ring = document.querySelector('.cursor-ring'); const label = ring?.querySelector('span');
    let mx=-100,my=-100,rx=-100,ry=-100;
    addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.transform=`translate(${mx}px,${my}px)`},{passive:true});
    const loop=()=>{rx+=(mx-rx)*.16;ry+=(my-ry)*.16;ring.style.transform=`translate(${rx}px,${ry}px)`;requestAnimationFrame(loop)};loop();
    document.querySelectorAll('a,button,[data-cursor]').forEach(el=>{
      el.addEventListener('mouseenter',()=>{ring.classList.add('active');label.textContent=el.dataset.cursor||''});
      el.addEventListener('mouseleave',()=>{ring.classList.remove('active');label.textContent=''});
    });
  }

  function initCanvases(disabled){
    document.querySelectorAll('canvas.generative-canvas').forEach(canvas => {
      const engine = new GenerativeEngine(canvas, canvas.dataset.animation || 'mod-grid', disabled);
      canvas._engine = engine; engine.start();
    });
  }

  function initMotionLab(){
    const canvas=document.getElementById('motionLabCanvas'); if(!canvas) return;
    const buttons=[...document.querySelectorAll('.lab-button[data-mode]')]; const pause=document.querySelector('.pause-control');
    const title=document.getElementById('labTitle'); const meta=document.getElementById('labMeta'); const desc=document.getElementById('labDescription');
    const copy={
      'mod-grid':['MOD GRID FLOW','Trigonometric deformation / particle field','A modular point grid deformed by radial and trigonometric fields, adapted from the MATLAB animation concept.'],
      'rings':['ROTATING RINGS','Circular harmonics / phase rotation','Concentric point systems rotate at different phase rates to create a controlled interference-like visual structure.'],
      'layers':['MULTI-LAYER ROTATION','Fourteen layers / differential angular velocity','Multiple rotational layers evolve at different angular velocities, producing a dense but ordered generative field.']
    };
    buttons.forEach(btn=>btn.addEventListener('click',()=>{buttons.forEach(b=>b.classList.remove('active'));btn.classList.add('active');canvas._engine?.setMode(btn.dataset.mode);const c=copy[btn.dataset.mode];title.textContent=c[0];meta.textContent=c[1];desc.textContent=c[2]}));
    pause?.addEventListener('click',()=>{const paused=canvas._engine?.togglePause();pause.textContent=paused?'Resume':'Pause'});
  }

  function GenerativeEngine(canvas, mode, staticOnly){
    this.canvas=canvas; this.ctx=canvas.getContext('2d',{alpha:true}); this.mode=mode; this.staticOnly=staticOnly;
    this.running=false; this.manualPause=false; this.visible=true; this.t=0; this.last=0; this.dpr=1; this.w=0; this.h=0;
    this.resize=()=>{const r=canvas.getBoundingClientRect();this.dpr=Math.min(devicePixelRatio||1,2);this.w=Math.max(1,r.width);this.h=Math.max(1,r.height);canvas.width=Math.round(this.w*this.dpr);canvas.height=Math.round(this.h*this.dpr);this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0);this.prepare();this.draw(0)};
    new ResizeObserver(this.resize).observe(canvas);
    const io=new IntersectionObserver(e=>{this.visible=e[0]?.isIntersecting??true;if(this.visible)this.resume()},{rootMargin:'150px'});io.observe(canvas);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)this.resume()});
    this.setMode=m=>{this.mode=m;this.t=0;this.prepare();this.draw(0)};
    this.togglePause=()=>{this.manualPause=!this.manualPause;if(!this.manualPause)this.resume();return this.manualPause};
    this.start=()=>{this.resize();if(!staticOnly)this.resume()};
    this.resume=()=>{if(this.running||this.manualPause||staticOnly)return;this.running=true;this.last=performance.now();requestAnimationFrame(this.frame.bind(this))};
    this.frame=now=>{if(this.manualPause||document.hidden||!this.visible){this.running=false;return}const dt=Math.min(.04,(now-this.last)/1000);this.last=now;this.t+=dt;this.draw(dt);requestAnimationFrame(this.frame.bind(this))};
    this.prepare=()=>{
      const mobile=this.w<700;const hc=navigator.hardwareConcurrency||4;const factor=hc<=4?.65:1;
      if(this.mode==='mod-grid'){const target=Math.floor((mobile?950:2200)*factor);const cols=Math.max(35,Math.floor(Math.sqrt(target*1.25)));const rows=Math.max(25,Math.floor(target/cols));this.points=[];for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)this.points.push([x,y,cols,rows]);}
      if(this.mode==='rings'){this.ringCount=mobile?8:13;this.ringPoints=mobile?55:90;}
      if(this.mode==='layers'){this.layerCount=mobile?9:14;this.layerPoints=mobile?70:120;}
    };
    this.draw=()=>{const ctx=this.ctx,w=this.w,h=this.h,t=this.t;ctx.clearRect(0,0,w,h);if(this.mode==='mod-grid')drawMod(ctx,w,h,t,this.points);else if(this.mode==='rings')drawRings(ctx,w,h,t,this.ringCount,this.ringPoints);else drawLayers(ctx,w,h,t,this.layerCount,this.layerPoints)};
  }

  function drawMod(ctx,w,h,t,points){
    const cx=w/2,cy=h/2,scale=Math.min(w,h)*.43;
    for(let n=0;n<points.length;n++){
      const [x,y,cols,rows]=points[n];
      const nx=(x/(cols-1)-.5)*2, ny=(y/(rows-1)-.5)*2;
      const radius=Math.hypot(nx,ny), angle=Math.atan2(ny,nx);
      const flowX=Math.sin(ny*3.4+t*.75)*.16+Math.cos(angle*4-t*.55)*.07;
      const flowY=Math.cos(nx*3.1-t*.62)*.16+Math.sin(angle*3+t*.48)*.07;
      const twist=Math.sin(radius*8-t*1.1)*.055;
      const X=cx+(nx+flowX+Math.cos(angle)*twist)*scale;
      const Y=cy+(ny+flowY+Math.sin(angle)*twist)*scale;
      const accent=n%83===0;
      ctx.fillStyle=accent?'rgba(100,216,209,.78)':'rgba(239,237,231,.42)';
      const size=accent?1.8:1.15;ctx.fillRect(X,Y,size,size);
    }
  }
  function drawRings(ctx,w,h,t,rings,pts){
    const cx=w/2,cy=h/2,max=Math.min(w,h)*.45;
    for(let r=1;r<=rings;r++){const rad=max*r/rings;const speed=(r%2?1:-1)*(.08+r*.013);for(let i=0;i<pts;i++){const a=i/pts*Math.PI*2+t*speed;const wobble=Math.sin(a*3+t*.6+r)*rad*.035;const x=cx+Math.cos(a)*(rad+wobble);const y=cy+Math.sin(a)*(rad*.62+wobble);ctx.fillStyle=(i+r)%83===0?'rgba(240,97,75,.82)':'rgba(239,237,231,.32)';ctx.fillRect(x,y,1.2,1.2)}}
  }
  function drawLayers(ctx,w,h,t,layers,pts){
    const cx=w/2,cy=h/2,max=Math.min(w,h)*.42;
    for(let l=1;l<=layers;l++){const base=max*(.22+.78*l/layers);const speed=(l%2?1:-1)*(.035+l*.009);for(let i=0;i<pts;i++){const a=i/pts*Math.PI*2+t*speed*4;const wave=Math.sin(a*(2+l%5)+t*.7)*base*.09;const r=base+wave;const x=cx+Math.cos(a+l*.21)*r;const y=cy+Math.sin(a)*r*.72;ctx.fillStyle=(l===layers||i%109===0)?'rgba(100,216,209,.56)':'rgba(239,237,231,.24)';ctx.fillRect(x,y,1,1)}}
  }
})();
