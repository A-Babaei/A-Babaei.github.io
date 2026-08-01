// Certificate data for A. Babaei portfolio
// Add a new object below and drop the matching image into /certificates/ to publish a new certification.
window.CERT_DATA = [
  {
    "id": 1,
    "title": "Biotechnology Summer School",
    "issuer": "Amirkabir University of Technology",
    "date": "Sep 2021",
    "category": "Workshop",
    "image": "certificates/cert-01-biotech-summer-school.jpg",
    "desc": "Certificate of appreciation for attending the Biotechnology Course in the Summer School of Amirkabir University of Technology."
  },
  {
    "id": 2,
    "title": "AUT International Winter School of Business",
    "issuer": "Amirkabir University of Technology (Tehran Polytechnic)",
    "date": "Jan – Mar 2022",
    "category": "Executive Program",
    "image": "certificates/cert-02-aut-winter-school-business.jpg",
    "desc": "Recognition for contribution as a member of the executive team of the AUT International Winter School of Business."
  },
  {
    "id": 3,
    "title": "HSE (Health, Safety & Environment) Workshop",
    "issuer": "University Training Workshop",
    "date": "2023",
    "category": "Safety Training",
    "image": "certificates/cert-03-hse-workshop.jpg",
    "desc": "Completion of an 8-hour Health, Safety and Environment (HSE) training workshop."
  },
  {
    "id": 4,
    "title": "1st Int'l Symposium on Applications of AI (AOAI2022)",
    "issuer": "National University of Science & Technology / Shiraz University of Technology",
    "date": "Nov 2022",
    "category": "Conference",
    "image": "certificates/cert-04-aoai2022-symposium.jpg",
    "desc": "Certificate of participation for presenting research estimating neck angle from upper-trapezius EMG activity using curve fitting."
  },
  {
    "id": 5,
    "title": "Researcher Training Program in Neuroscience & Cognitive Sciences",
    "issuer": "Interdisciplinary Schools, Tehran",
    "date": "Jul – Sep 2024",
    "category": "Training Program",
    "image": "certificates/cert-05-neuroscience-training.jpg",
    "desc": "Participation in a 10-session, 30-hour virtual researcher training program in neuroscience and cognitive sciences."
  },
  {
    "id": 6,
    "title": "Learn SQL",
    "issuer": "Codecademy",
    "date": "2024",
    "category": "Online Course",
    "image": "certificates/cert-06-codecademy-sql.jpg",
    "desc": "Completion of the Learn SQL course, including the Multiple Tables module."
  },
  {
    "id": 7,
    "title": "8th Iranian Human Brain Mapping Congress",
    "issuer": "Shahid Beheshti University",
    "date": "Nov 2021",
    "category": "Conference",
    "image": "certificates/cert-07-ihbm2021.jpg",
    "desc": "Certificate of attendance at the 8th Iranian Human Brain Mapping Congress, Tehran, Iran."
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
