// Coding project data for A. Babaei portfolio
// Add a new object below and drop the matching image into /coding-projects/ to publish a new project.
window.PROJECT_DATA = [
{
  "id": 1,
  "title": "User Activity Insights",
  "issuer": "WordPress Plugin — Adschi.com",
  "date": "v1.3.0",
  "category": "WordPress Plugin",
  "image": "coding-projects/proj-01-user-activity-insights.jpg",
  "desc": "Tracks logged-in user activity per page or course with per-user and overall reports, inactive-user detection, CSV export and configurable data retention."
},
{
  "id": 2,
  "title": "Code-Highlighter",
  "issuer": "Academy Code Highlighter — Adschi.com",
  "date": "v1.1.2",
  "category": "WordPress Plugin",
  "image": "coding-projects/proj-02-code-highlighter.jpg",
  "desc": "Automatic Prism.js syntax highlighting for WordPress code blocks with line numbers, one-click copy and a dark Tomorrow Night theme."
},
{
  "id": 3,
  "title": "CodeSandbox Embed",
  "issuer": "Adschi.com",
  "date": "v2.0.0",
  "category": "WordPress Plugin",
  "image": "coding-projects/proj-03-codesandbox-embed.jpg",
  "desc": "Embeddable Python and SQL code runner with Docker-sandboxed execution, per-user authentication, rate limiting and a zero-dependency frontend."
},
{
  "id": 4,
  "title": "LearnPress Commerce Bridge",
  "issuer": "Adschi.com",
  "date": "v1.1.0",
  "category": "WordPress Plugin",
  "image": "coding-projects/proj-04-learnpress-commerce-bridge.jpg",
  "desc": "Bridges LearnPress courses with WooCommerce as virtual products, syncing enrollment automatically and supporting coupon restrictions."
},
{
  "id": 5,
  "title": "Block Content Protection",
  "issuer": "Adschi.com",
  "date": "v1.6.4",
  "category": "WordPress Plugin",
  "image": "coding-projects/proj-05-block-content-protection.jpg",
  "desc": "Disables right-click, text selection and copying, with screenshot and screen-recording deterrents, IP whitelisting and page exclusions."
},
{
  "id": 6,
  "title": "SecurePlay Video Player",
  "issuer": "Adschi.com",
  "date": "v1.0.0",
  "category": "WordPress Plugin",
  "image": "coding-projects/proj-06-secureplay-video-player.jpg",
  "desc": "Self-hosted HTML5 video player with hotlink protection, login and role-based access control, dynamic watermarking and per-play access logs."
}
];

function renderProtectedProject(canvas, src){
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var img = new Image();
  img.onload = function(){
    function draw(){
      var host = canvas.parentElement;
      var w = host.clientWidth, h = host.clientHeight;
      if(!w || !h) return;
      var dpr = Math.min(window.devicePixelRatio||1, 2);
      canvas.width = w*dpr; canvas.height = h*dpr;
      canvas.style.width = w+'px'; canvas.style.height = h+'px';
      ctx.setTransform(dpr,0,0,dpr,0,0);
      var ir = img.naturalWidth/img.naturalHeight, cr = w/h, sx,sy,sw,sh;
      if(ir > cr){ sh = img.naturalHeight; sw = sh*cr; sx=(img.naturalWidth-sw)/2; sy=0; }
      else { sw = img.naturalWidth; sh = sw/cr; sx=0; sy=(img.naturalHeight-sh)/2; }
      ctx.clearRect(0,0,w,h);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      ctx.save();
      ctx.globalCompositeOperation = 'difference';
      ctx.globalAlpha = .55;
      ctx.fillStyle = '#9a9a9a';
      ctx.font = '700 11px Arial';
      ctx.translate(w/2, h/2);
      ctx.rotate(-Math.PI/10);
      var text = 'A. BABAEI · VERIFIED EVIDENCE · NOT FOR DISTRIBUTION';
      for(var y=-h*1.4; y<h*1.4; y+=34){ ctx.fillText(text, -w*1.2, y); }
      ctx.restore();
    }
    draw();
    if('ResizeObserver' in window){ new ResizeObserver(draw).observe(canvas.parentElement); }
    else { window.addEventListener('resize', draw); }
  };
  img.onerror = function(){
    var host = canvas.parentElement;
    if(host) host.innerHTML = '<div style="padding:20px;color:#9eb1bf;font-size:.78rem">Preview unavailable</div>';
  };
  img.src = src;
  canvas.addEventListener('contextmenu', function(e){ e.preventDefault(); });
  canvas.setAttribute('draggable','false');
}
window.renderProtectedProject = renderProtectedProject;
