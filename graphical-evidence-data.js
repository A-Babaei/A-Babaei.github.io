// Graphical evidence data for A. Babaei portfolio
// Add a new object below and drop the matching image into /graphical-evidence/ (or reuse an existing asset) to publish new graphical evidence.
window.GRAPHIC_DATA = [
  {
    "id": 1,
    "title": "Personal Logo Mark",
    "issuer": "A. Babaei — Brand Identity",
    "date": "2024",
    "category": "Personal Logo",
    "image": "logo-full.webp",
    "desc": "Original monogram and wordmark designed as the personal brand identity for A. Babaei, biomedical engineer."
  }
];

function renderProtectedCert(canvas, src){
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
window.renderProtectedCert = renderProtectedCert;
