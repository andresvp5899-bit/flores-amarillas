const garden = document.querySelector('#garden');
const sky = document.querySelector('#sky');
const ctx = sky.getContext('2d');
let stars = [];

function makeFlower(index, total) {
  const flower = document.createElement('div');
  flower.className = 'flower';
  const x = 48 + (index / Math.max(1,total - 1)) * 56;
  const scale = .55 + Math.random() * .7;
  flower.style.cssText = `--x:${x}%;--scale:${scale};--delay:${(.25 + index * .12).toFixed(2)}s;--sway:${(2 + Math.random()*5).toFixed(1)}deg;z-index:${Math.round(scale*10)}`;
  const bloom = document.createElement('div');
  bloom.className = 'bloom';
  for (let i=0;i<12;i++) bloom.innerHTML += `<span class="petal" style="--r:${i*30}deg"></span>`;
  for (let i=0;i<10;i++) bloom.innerHTML += `<span class="petal inner" style="--r:${i*36+18}deg"></span>`;
  bloom.innerHTML += '<span class="center"></span>';
  flower.innerHTML = '<span class="stem"></span><span class="leaf a"></span><span class="leaf b"></span>';
  flower.appendChild(bloom);
  garden.appendChild(flower);
}

function plantGarden(){ garden.innerHTML=''; const total=innerWidth<760?9:15; for(let i=0;i<total;i++) makeFlower(i,total); }

function resize(){
  const dpr=Math.min(devicePixelRatio,2); sky.width=innerWidth*dpr; sky.height=innerHeight*dpr; sky.style.width=innerWidth+'px'; sky.style.height=innerHeight+'px'; ctx.setTransform(dpr,0,0,dpr,0,0);
  stars=Array.from({length:90},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight*.72,r:Math.random()*1.4+.2,a:Math.random(),v:Math.random()*.012+.003}));
}
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){s.a+=s.v;if(s.a>1||s.a<.15)s.v*=-1;ctx.beginPath();ctx.fillStyle=`rgba(255,236,146,${s.a})`;ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}requestAnimationFrame(draw)}

function sparkle(x,y,count=8){for(let i=0;i<count;i++){const s=document.createElement('i');s.className='spark';s.style.left=x+'px';s.style.top=y+'px';const a=Math.random()*Math.PI*2,d=25+Math.random()*65;s.style.setProperty('--dx',Math.cos(a)*d+'px');s.style.setProperty('--dy',Math.sin(a)*d+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),1300)}}
let last=0; addEventListener('pointermove',e=>{if(Date.now()-last>85){sparkle(e.clientX,e.clientY,1);last=Date.now()}});
addEventListener('pointerdown',e=>sparkle(e.clientX,e.clientY,12));

// Corazones que flotan por todo el universo y explotan al tocar la pantalla
function floatingHeart(){const h=document.createElement('i');h.className='floating-heart';h.textContent=Math.random()>.25?'♥':'♡';h.style.setProperty('--hx',Math.random()*96+'vw');h.style.setProperty('--hs',(.7+Math.random()*1.5)+'rem');h.style.setProperty('--hd',(7+Math.random()*6)+'s');h.style.setProperty('--drift',(-60+Math.random()*120)+'px');document.body.appendChild(h);setTimeout(()=>h.remove(),13500)}
setInterval(floatingHeart,700);for(let i=0;i<8;i++)setTimeout(floatingHeart,i*240);
function burstHearts(x,y){for(let i=0;i<9;i++){const h=document.createElement('i'),a=Math.PI*2*i/9+Math.random()*.35,d=45+Math.random()*80;h.className='heart-pop';h.textContent=i%3?'♥':'♡';h.style.left=x+'px';h.style.top=y+'px';h.style.setProperty('--px',Math.cos(a)*d+'px');h.style.setProperty('--py',Math.sin(a)*d+'px');h.style.setProperty('--pr',(-45+Math.random()*90)+'deg');document.body.appendChild(h);setTimeout(()=>h.remove(),1600)}}
addEventListener('pointerdown',e=>burstHearts(e.clientX,e.clientY));

const letter=document.querySelector('#letter');
const memories=document.querySelector('#memories');
document.querySelector('#reveal').addEventListener('click',e=>{letter.classList.add('open');letter.setAttribute('aria-hidden','false');sparkle(e.clientX,e.clientY,22);startMusic()});
document.querySelector('#close').addEventListener('click',()=>{letter.classList.remove('open');letter.setAttribute('aria-hidden','true')});
letter.addEventListener('click',e=>{if(e.target===letter)document.querySelector('#close').click()});
document.querySelector('.letter-card').addEventListener('click',e=>{if(!e.target.closest('button')){letter.classList.remove('open');memories.classList.add('open');memories.setAttribute('aria-hidden','false');startPetals()}});
document.querySelector('#letter-title').insertAdjacentHTML('afterend','<button class="continue" type="button" style="border:0;background:none;color:#9b7515;font:600 .7rem Montserrat;letter-spacing:.15em;cursor:pointer">VER NUESTROS RECUERDOS →</button>');
document.querySelector('.continue').addEventListener('click',()=>{letter.classList.remove('open');memories.classList.add('open');memories.setAttribute('aria-hidden','false');startPetals()});
document.querySelector('#memoriesClose').addEventListener('click',()=>{memories.classList.remove('open');memories.setAttribute('aria-hidden','true')});
addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelector('#close').click()});

// Galería automática
const photos=[...document.querySelectorAll('.photo')],dots=[...document.querySelectorAll('.dots button')];let currentPhoto=0;
function showPhoto(n){photos[currentPhoto].classList.remove('active');photos[currentPhoto].classList.add('leaving');dots[currentPhoto].classList.remove('active');setTimeout(()=>photos.forEach(p=>p.classList.remove('leaving')),1000);currentPhoto=(n+photos.length)%photos.length;photos[currentPhoto].classList.add('active');dots[currentPhoto].classList.add('active')}
dots.forEach((d,i)=>d.addEventListener('click',()=>showPhoto(i)));setInterval(()=>{if(memories.classList.contains('open'))showPhoto(currentPhoto+1)},4300);

// Canción elegida para esta página
const loveSong=document.querySelector('#loveSong');let isPlaying=false;loveSong.volume=.82;
function startMusic(){if(isPlaying)return;loveSong.play().then(()=>{isPlaying=true;document.querySelector('#music').classList.add('playing');document.querySelector('#musicText').textContent='Nuestra canción'}).catch(()=>{})}
function stopMusic(){loveSong.pause();isPlaying=false;document.querySelector('#music').classList.remove('playing');document.querySelector('#musicText').textContent='Música'}
document.querySelector('#music').addEventListener('click',()=>isPlaying?stopMusic():startMusic());

// Pétalos dorados cayendo sobre la galería
const petals=document.querySelector('#petals'),pctx=petals.getContext('2d');let flakes=[];
function startPetals(){petals.width=innerWidth;petals.height=innerHeight;if(!flakes.length)flakes=Array.from({length:38},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:3+Math.random()*6,v:.4+Math.random()*1.1,w:Math.random()*6}));}
function drawPetals(){pctx.clearRect(0,0,petals.width,petals.height);flakes.forEach((f,i)=>{f.y+=f.v;f.x+=Math.sin(f.y*.012)*.35;f.w+=.025;if(f.y>innerHeight+10){f.y=-10;f.x=Math.random()*innerWidth}pctx.save();pctx.translate(f.x,f.y);pctx.rotate(f.w);pctx.fillStyle=i%5===0?'rgba(255,120,145,.7)':'rgba(255,210,45,.7)';pctx.beginPath();if(i%5===0){pctx.moveTo(0,3);pctx.bezierCurveTo(-10,-4,-6,-12,0,-6);pctx.bezierCurveTo(6,-12,10,-4,0,3)}else{pctx.ellipse(0,0,f.r,f.r*.45,0,0,Math.PI*2)}pctx.fill();pctx.restore()});requestAnimationFrame(drawPetals)}drawPetals();

resize();plantGarden();draw();addEventListener('resize',()=>{resize();plantGarden()});
