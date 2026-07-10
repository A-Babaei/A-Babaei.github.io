(() => {
  const $ = (s, c=document) => c.querySelector(s);
  const $$ = (s, c=document) => [...c.querySelectorAll(s)];
  const progress = $('#scrollProgress');
  const header = $('.site-header');
  const menuButton = $('.menu-toggle');
  const menu = $('.nav-list');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const pct = max > 0 ? (scrollY / max) * 100 : 0;
    if (progress) progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    if (header) header.classList.toggle('scrolled', scrollY > 24);
  };
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  if(menuButton && menu){
    menuButton.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    $$('a', menu).forEach(a => a.addEventListener('click', () => {
      menu.classList.remove('open'); menuButton.setAttribute('aria-expanded','false');
    }));
  }

  const year = $('#year'); if(year) year.textContent = new Date().getFullYear();

  const reveals = $$('.reveal');
  if(reduced || !('IntersectionObserver' in window)) reveals.forEach(x=>x.classList.add('visible'));
  else {
    const io = new IntersectionObserver((entries, obs) => entries.forEach(e => {
      if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target)}
    }), {threshold:.11, rootMargin:'0px 0px -45px'});
    reveals.forEach(x=>io.observe(x));
  }

  // Browser-native mathematical motion, adapted from the user's MATLAB concepts.
  class MotionCanvas {
    constructor(canvas){
      this.canvas=canvas; this.ctx=canvas.getContext('2d'); this.mode=canvas.dataset.animation||'grid';
      this.running=!reduced; this.visible=true; this.t=0; this.raf=0; this.last=performance.now();
      this.resize=this.resize.bind(this); this.frame=this.frame.bind(this);
      this.ro=new ResizeObserver(this.resize); this.ro.observe(canvas); this.resize();
      this.io=new IntersectionObserver(es=>{this.visible=es[0].isIntersecting; if(this.visible&&this.running)this.start(); else this.stop();},{threshold:.02});
      this.io.observe(canvas); document.addEventListener('visibilitychange',()=>document.hidden?this.stop():this.start());
      canvas.motion=this; if(this.running)this.start(); else this.drawStatic();
    }
    resize(){const r=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.dpr=d;this.w=Math.max(1,r.width);this.h=Math.max(1,r.height);this.canvas.width=Math.round(this.w*d);this.canvas.height=Math.round(this.h*d);this.ctx.setTransform(d,0,0,d,0,0);this.drawStatic()}
    setMode(m){this.mode=m;this.t=0;this.drawStatic()}
    start(){if(!this.running||!this.visible||document.hidden||this.raf)return;this.last=performance.now();this.raf=requestAnimationFrame(this.frame)}
    stop(){if(this.raf)cancelAnimationFrame(this.raf);this.raf=0}
    pause(){this.running=false;this.stop()}
    play(){this.running=true;this.start()}
    frame(now){this.raf=0;const dt=Math.min((now-this.last)/1000,.05);this.last=now;this.t+=dt;this.draw();this.start()}
    clear(){const c=this.ctx;c.clearRect(0,0,this.w,this.h);c.fillStyle='#060606';c.fillRect(0,0,this.w,this.h)}
    dot(x,y,r=1,a=.35,color='97,213,207'){const c=this.ctx;c.fillStyle=`rgba(${color},${a})`;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fill()}
    drawStatic(){this.draw(true)}
    draw(staticFrame=false){this.clear();const t=staticFrame?1.2:this.t; if(this.mode==='rings')this.rings(t); else if(this.mode==='layers')this.layers(t); else this.grid(t)}
    grid(t){const step=this.w<600?16:13,cx=this.w*.56,cy=this.h*.48;for(let y=-40;y<this.h+40;y+=step){for(let x=-40;x<this.w+40;x+=step){const dx=(x-cx)/90,dy=(y-cy)/90,r=Math.hypot(dx,dy)+.001;const ang=r*.95-t*.35;const nx=x+Math.sin(ang+dy*1.8)*18+Math.cos(t*.25+dy)*8;const ny=y+Math.cos(ang+dx*1.5)*15;const alpha=.08+.32*(.5+.5*Math.sin(r*2.4-t));this.dot(nx,ny,this.w<600?.65:.85,alpha)}}}
    rings(t){const cx=this.w/2,cy=this.h/2,max=Math.min(this.w,this.h)*.42;for(let ring=1;ring<=11;ring++){const rad=max*ring/11;const pts=90+ring*7;for(let i=0;i<pts;i++){const a=i/pts*Math.PI*2+t*(.035+ring*.003);const wob=Math.sin(a*3+t*.7+ring)*7;const x=cx+(rad+wob)*Math.cos(a);const y=cy+(rad+wob)*Math.sin(a);this.dot(x,y,ring%3===0?1.15:.7,.12+ring*.015,ring%4===0?'255,104,75':'97,213,207')}}}
    layers(t){const cx=this.w/2,cy=this.h/2,max=Math.min(this.w,this.h)*.43;for(let layer=0;layer<14;layer++){const n=45+layer*5,rr=max*(.16+layer*.055);for(let i=0;i<n;i++){const a=i/n*Math.PI*2+t*(layer%2?-.07:.055)*(1+layer*.03);const pulse=1+.10*Math.sin(t*.7+layer+i*.05);const x=cx+rr*pulse*Math.cos(a)+Math.sin(a*5+t)*4;const y=cy+rr*pulse*Math.sin(a)+Math.cos(a*4-t)*4;this.dot(x,y,layer%5===0?1.15:.72,.13+layer*.01,layer%6===0?'255,104,75':'97,213,207')}}}
  }
  const motions = $$('.motion-canvas').map(c=>new MotionCanvas(c));
  $$('.motion-controls').forEach(group=>{
    const target=$(group.dataset.target); if(!target?.motion)return;
    $$('[data-mode]',group).forEach(b=>b.addEventListener('click',()=>{target.motion.setMode(b.dataset.mode);$$('[data-mode]',group).forEach(x=>x.classList.remove('active'));b.classList.add('active')}));
    $('[data-action="pause"]',group)?.addEventListener('click',()=>target.motion.pause());
    $('[data-action="play"]',group)?.addEventListener('click',()=>target.motion.play());
  });
})();
