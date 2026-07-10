(() => {
  "use strict";
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const progress=$("#scrollProgress"), header=$(".site-header");
  const onScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight; if(progress)progress.style.width=`${max>0?Math.min(100,scrollY/max*100):0}%`; header?.classList.toggle("scrolled",scrollY>24)};
  addEventListener("scroll",onScroll,{passive:true});onScroll();

  const toggle=$(".menu-toggle"), nav=$(".nav-links");
  toggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));document.body.classList.toggle("menu-open",open)});
  $$(".nav-links a").forEach(a=>a.addEventListener("click",()=>{nav?.classList.remove("open");document.body.classList.remove("menu-open");toggle?.setAttribute("aria-expanded","false")}));

  const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(!reduced && "IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("visible");io.unobserve(e.target)}}),{threshold:.12,rootMargin:"0px 0px -50px"});$$('.reveal').forEach(e=>io.observe(e));}else{$$('.reveal').forEach(e=>e.classList.add('visible'))}

  // Protection deterrents. These cannot provide absolute protection for public web content.
  document.addEventListener("contextmenu",e=>{if(e.target.closest(".protected-media"))e.preventDefault()});
  document.addEventListener("dragstart",e=>{if(e.target.closest(".protected-media"))e.preventDefault()});
  document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&["s","u"].includes(e.key.toLowerCase())){e.preventDefault();showNotice("Public preview protection enabled")}});
  if(top!==self){try{top.location=self.location}catch(_){}}
  function showNotice(msg){let n=$(".site-notice");if(!n){n=document.createElement("div");n.className="site-notice";Object.assign(n.style,{position:"fixed",left:"50%",bottom:"24px",transform:"translateX(-50%)",zIndex:6000,padding:"11px 16px",border:"1px solid rgba(255,255,255,.2)",borderRadius:"999px",background:"rgba(6,7,10,.88)",backdropFilter:"blur(15px)",font:"700 12px ui-monospace",color:"#fff"});document.body.append(n)}n.textContent=msg;n.style.opacity=1;clearTimeout(n._t);n._t=setTimeout(()=>n.style.opacity=0,1800)}

  // Populate website cards
  const webHost=$("[data-websites]");
  if(webHost&&window.PORTFOLIO_DATA){webHost.innerHTML=PORTFOLIO_DATA.websites.map((w,i)=>`<article class="web-card glass-card reveal"><div class="web-top"><span>0${i+1} / ${w.type}</span><span>External ↗</span></div><div><h3>${w.title}</h3><p><strong>${w.role}</strong><br>${w.description}</p><a class="arrow-link" href="${w.url}" target="_blank" rel="noopener noreferrer">Visit website <span>↗</span></a></div></article>`).join("");webHost.querySelectorAll('.reveal').forEach(e=>e.classList.add('visible'))}

  // Populate sliders
  $$('[data-gallery]').forEach(host=>{
    const key=host.dataset.gallery, items=window.PORTFOLIO_DATA?.galleries?.[key]||[];
    const track=host.querySelector('.slider-track'), count=host.querySelector('.slider-count');
    if(!track||!items.length)return;
    track.innerHTML=items.map((it,i)=>`<article class="slide glass-card protected-media watermarked ${i===0?'active':''}"><div class="slide-media"><img src="${it.image}" alt="${it.title} preview" loading="lazy" draggable="false"><div class="slide-overlay"><small>${it.meta}</small><h3>${it.title}</h3><p>${it.description}</p></div></div></article>`).join('');
    let index=0;const slides=$$('.slide',track);
    const update=()=>{slides.forEach((s,i)=>s.classList.toggle('active',i===index));const shell=host.getBoundingClientRect(), target=slides[index];const offset=target.offsetLeft-(host.clientWidth-target.clientWidth)/2;track.style.transform=`translate3d(${-Math.max(0,offset)}px,0,0)`;if(count)count.textContent=`${String(index+1).padStart(2,'0')} / ${String(items.length).padStart(2,'0')}`};
    host.querySelector('[data-prev]')?.addEventListener('click',()=>{index=(index-1+items.length)%items.length;update()});
    host.querySelector('[data-next]')?.addEventListener('click',()=>{index=(index+1)%items.length;update()});
    let startX=0;track.addEventListener('pointerdown',e=>startX=e.clientX);track.addEventListener('pointerup',e=>{const d=e.clientX-startX;if(Math.abs(d)>45){index=(index+(d<0?1:-1)+items.length)%items.length;update()}});
    addEventListener('resize',update);setTimeout(update,80);
  });

  // Pointer glow for glass cards
  $$('.web-card').forEach(card=>card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',`${e.clientX-r.left-r.width/2}px`);card.style.setProperty('--my',`${e.clientY-r.top-r.height/2}px`)}));

  // Neural silhouette particle canvas
  function neuralCanvas(canvas){if(!canvas||reduced)return;const ctx=canvas.getContext('2d',{alpha:true});let w=0,h=0,dpr=1,raf=0,visible=true,pts=[],mouse={x:-9999,y:-9999};
    const seedPoints=()=>{pts=[];const count=Math.min(innerWidth<700?950:2400,Math.max(700,Math.floor(w*h/420)));for(let i=0;i<count;i++){let part=Math.random(),x,y;if(part<.3){const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random());x=Math.cos(a)*r*.13;y=-.30+Math.sin(a)*r*.19;}else{const yy=Math.random(),half=.12+.26*Math.sin(yy*Math.PI);x=(Math.random()*2-1)*half*(.75+.25*Math.random());y=-.08+yy*.75;x+=Math.sin(yy*8+i)*.015}pts.push({x,y,z:Math.random(),p:Math.random()*Math.PI*2})}}
    const resize=()=>{const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);seedPoints()};new ResizeObserver(resize).observe(canvas);resize();
    canvas.addEventListener('pointermove',e=>{const r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top});canvas.addEventListener('pointerleave',()=>mouse={x:-9999,y:-9999});
    const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!raf)loop(performance.now())},{threshold:.05});io.observe(canvas);document.addEventListener('visibilitychange',()=>visible=!document.hidden);
    function loop(t){raf=0;if(!visible)return;ctx.clearRect(0,0,w,h);const scale=Math.min(w,h)*1.15,cx=w*.72,cy=h*.5;for(const q of pts){const wave=Math.sin(t*.00055+q.p+q.y*7)*.012;let x=cx+(q.x+wave)*scale,y=cy+q.y*scale;const dx=x-mouse.x,dy=y-mouse.y,dist=Math.hypot(dx,dy),light=Math.max(0,1-dist/260);const alpha=.12+q.z*.46+light*.55;ctx.fillStyle=light>.2?`rgba(99,230,213,${Math.min(.95,alpha)})`:`rgba(235,239,240,${alpha})`;const s=.55+q.z*1.05+light*1.2;ctx.beginPath();ctx.arc(x,y,s,0,Math.PI*2);ctx.fill()}raf=requestAnimationFrame(loop)}loop(0)}
  neuralCanvas($("#neuralCanvas"));

  // Abstract mathematical canvas
  function mathCanvas(canvas){if(!canvas||reduced)return;const ctx=canvas.getContext('2d');let w,h,dpr,t=0,raf;const resize=()=>{const r=canvas.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);w=r.width;h=r.height;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)};new ResizeObserver(resize).observe(canvas);resize();function loop(){t+=.009;ctx.clearRect(0,0,w,h);const cx=w/2,cy=h/2;for(let ring=0;ring<18;ring++){const n=44+ring*3,rad=25+ring*12;for(let i=0;i<n;i++){const a=i/n*Math.PI*2+t*(ring%2?.7:-.45);const wob=Math.sin(a*3+t*4+ring)*9;const x=cx+Math.cos(a)*(rad+wob),y=cy+Math.sin(a)*(rad*.62+wob*.45);ctx.fillStyle=`rgba(${ring%3===0?'99,230,213':'235,239,240'},${.08+ring/80})`;ctx.fillRect(x,y,1.2,1.2)}}raf=requestAnimationFrame(loop)}loop()}mathCanvas($("#mathCanvas"));

  $("#printPage")?.addEventListener("click",()=>window.print());
  $("#year")&&( $("#year").textContent=new Date().getFullYear() );
})();