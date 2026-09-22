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

  for (let i=0;i<12;i++) {
    bloom.innerHTML += `<span class="petal" style="--r:${i*30}deg"></span>`;
  }

  for (let i=0;i<10;i++) {
    bloom.innerHTML += `<span class="petal inner" style="--r:${i*36+18}deg"></span>`;
  }

  bloom.innerHTML += '<span class="center"></span>';

  flower.innerHTML = `
    <span class="stem"></span>
    <span class="leaf a"></span>
    <span class="leaf b"></span>
  `;

  flower.appendChild(bloom);
  garden.appendChild(flower);
}

function plantGarden() {
  garden.innerHTML = '';

  const total = innerWidth < 760 ? 9 : 15;

  for(let i=0;i<total;i++) {
    makeFlower(i,total);
  }
}

function resize() {
  const dpr = Math.min(devicePixelRatio,2);

  sky.width = innerWidth*dpr;
  sky.height = innerHeight*dpr;
  sky.style.width = innerWidth+'px';
  sky.style.height = innerHeight+'px';

  ctx.setTransform(dpr,0,0,dpr,0,0);

  stars = Array.from({length:90},()=>({
    x:Math.random()*innerWidth,
    y:Math.random()*innerHeight*.72,
    r:Math.random()*1.4+.2,
    a:Math.random(),
    v:Math.random()*.012+.003
  }));
}

function draw() {
  ctx.clearRect(0,0,innerWidth,innerHeight);

  for(const s of stars) {
    s.a += s.v;

    if(s.a>1 || s.a<.15) {
      s.v *= -1;
    }

    ctx.beginPath();
    ctx.fillStyle = `rgba(255,236,146,${s.a})`;
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fill();
  }

  requestAnimationFrame(draw);
}

function sparkle(x,y,count=8) {
  for(let i=0;i<count;i++) {
    const s = document.createElement('i');

    s.className = 'spark';
    s.style.left = x+'px';
    s.style.top = y+'px';

    const angle = Math.random()*Math.PI*2;
    const distance = 25+Math.random()*65;

    s.style.setProperty(
      '--dx',
      Math.cos(angle)*distance+'px'
    );

    s.style.setProperty(
      '--dy',
      Math.sin(angle)*distance+'px'
    );

    document.body.appendChild(s);

    setTimeout(()=>{
      s.remove();
    },1300);
  }
}

let last=0;

addEventListener('pointermove',e=>{
  if(Date.now()-last>85) {
    sparkle(e.clientX,e.clientY,1);
    last=Date.now();
  }
});

addEventListener('pointerdown',e=>{
  sparkle(e.clientX,e.clientY,12);
});

// Corazones flotando por el universo
function floatingHeart() {
  const heart = document.createElement('i');

  heart.className = 'floating-heart';
  heart.textContent = Math.random()>.25 ? '♥' : '♡';

  heart.style.setProperty(
    '--hx',
    Math.random()*96+'vw'
  );

  heart.style.setProperty(
    '--hs',
    (.7+Math.random()*1.5)+'rem'
  );

  heart.style.setProperty(
    '--hd',
    (7+Math.random()*6)+'s'
  );

  heart.style.setProperty(
    '--drift',
    (-60+Math.random()*120)+'px'
  );

  document.body.appendChild(heart);

  setTimeout(()=>{
    heart.remove();
  },13500);
}

setInterval(floatingHeart,700);

for(let i=0;i<8;i++) {
  setTimeout(floatingHeart,i*240);
}

function burstHearts(x,y) {
  for(let i=0;i<9;i++) {
    const heart = document.createElement('i');
    const angle = Math.PI*2*i/9+Math.random()*.35;
    const distance = 45+Math.random()*80;

    heart.className = 'heart-pop';
    heart.textContent = i%3 ? '♥' : '♡';
    heart.style.left = x+'px';
    heart.style.top = y+'px';

    heart.style.setProperty(
      '--px',
      Math.cos(angle)*distance+'px'
    );

    heart.style.setProperty(
      '--py',
      Math.sin(angle)*distance+'px'
    );

    heart.style.setProperty(
      '--pr',
      (-45+Math.random()*90)+'deg'
    );

    document.body.appendChild(heart);

    setTimeout(()=>{
      heart.remove();
    },1600);
  }
}

addEventListener('pointerdown',e=>{
  burstHearts(e.clientX,e.clientY);
});

// Carta romántica
const letter = document.querySelector('#letter');
const memories = document.querySelector('#memories');

document.querySelector('#reveal').addEventListener('click',e=>{
  letter.classList.add('open');
  letter.setAttribute('aria-hidden','false');

  sparkle(e.clientX,e.clientY,22);
  startMusic();
});

document.querySelector('#close').addEventListener('click',()=>{
  letter.classList.remove('open');
  letter.setAttribute('aria-hidden','true');
});

letter.addEventListener('click',e=>{
  if(e.target===letter) {
    document.querySelector('#close').click();
  }
});

document.querySelector('.letter-card').addEventListener('click',e=>{
  if(!e.target.closest('button')) {
    letter.classList.remove('open');
    memories.classList.add('open');
    memories.setAttribute('aria-hidden','false');
    startPetals();
  }
});

document.querySelector('#letter-title').insertAdjacentHTML(
  'afterend',
  '<button class="continue" type="button" style="border:0;background:none;color:#9b7515;font:600 .7rem Montserrat;letter-spacing:.15em;cursor:pointer">VER NUESTROS RECUERDOS →</button>'
);

document.querySelector('.continue').addEventListener('click',()=>{
  letter.classList.remove('open');
  memories.classList.add('open');
  memories.setAttribute('aria-hidden','false');
  startPetals();
});

document.querySelector('#memoriesClose').addEventListener('click',()=>{
  memories.classList.remove('open');
  memories.setAttribute('aria-hidden','true');
});

addEventListener('keydown',e=>{
  if(e.key==='Escape') {
    document.querySelector('#close').click();
  }
});

// Galería automática
const photos = [
  ...document.querySelectorAll('.photo')
];

const dots = [
  ...document.querySelectorAll('.dots button')
];

let currentPhoto=0;

function showPhoto(n) {
  photos[currentPhoto].classList.remove('active');
  photos[currentPhoto].classList.add('leaving');
  dots[currentPhoto].classList.remove('active');

  setTimeout(()=>{
    photos.forEach(photo=>{
      photo.classList.remove('leaving');
    });
  },1000);

  currentPhoto=(n+photos.length)%photos.length;

  photos[currentPhoto].classList.add('active');
  dots[currentPhoto].classList.add('active');

  document.querySelector('#photoNumber').textContent=
    String(currentPhoto+1).padStart(2,'0');
}

dots.forEach((dot,index)=>{
  dot.addEventListener('click',()=>{
    showPhoto(index);
  });
});

setInterval(()=>{
  if(memories.classList.contains('open')) {
    showPhoto(currentPhoto+1);
  }
},4300);

document.querySelector('#photoPrev').addEventListener('click',()=>{
  showPhoto(currentPhoto-1);
});

document.querySelector('#photoNext').addEventListener('click',()=>{
  showPhoto(currentPhoto+1);
});

// Música
const loveSong = document.querySelector('#loveSong');
let isPlaying=false;

loveSong.volume=.82;

function startMusic() {
  if(isPlaying) return;

  loveSong.play().then(()=>{
    isPlaying=true;

    document.querySelector('#music').classList.add('playing');
    document.querySelector('#musicText').textContent=
      'Nuestra canción';
  }).catch(()=>{});
}

function stopMusic() {
  loveSong.pause();
  isPlaying=false;

  document.querySelector('#music').classList.remove('playing');
  document.querySelector('#musicText').textContent='Música';
}

document.querySelector('#music').addEventListener('click',()=>{
  isPlaying ? stopMusic() : startMusic();
});

// Pétalos dorados
const petals = document.querySelector('#petals');
const pctx = petals.getContext('2d');
let flakes=[];

function startPetals() {
  petals.width=innerWidth;
  petals.height=innerHeight;

  if(!flakes.length) {
    flakes=Array.from({length:38},()=>({
      x:Math.random()*innerWidth,
      y:Math.random()*innerHeight,
      r:3+Math.random()*6,
      v:.4+Math.random()*1.1,
      w:Math.random()*6
    }));
  }
}

function drawPetals() {
  pctx.clearRect(
    0,
    0,
    petals.width,
    petals.height
  );

  flakes.forEach((flake,index)=>{
    flake.y+=flake.v;
    flake.x+=Math.sin(flake.y*.012)*.35;
    flake.w+=.025;

    if(flake.y>innerHeight+10) {
      flake.y=-10;
      flake.x=Math.random()*innerWidth;
    }

    pctx.save();
    pctx.translate(flake.x,flake.y);
    pctx.rotate(flake.w);

    pctx.fillStyle=index%5===0
      ? 'rgba(255,120,145,.7)'
      : 'rgba(255,210,45,.7)';

    pctx.beginPath();

    if(index%5===0) {
      pctx.moveTo(0,3);
      pctx.bezierCurveTo(-10,-4,-6,-12,0,-6);
      pctx.bezierCurveTo(6,-12,10,-4,0,3);
    } else {
      pctx.ellipse(
        0,
        0,
        flake.r,
        flake.r*.45,
        0,
        0,
        Math.PI*2
      );
    }

    pctx.fill();
    pctx.restore();
  });

  requestAnimationFrame(drawPetals);
}

drawPetals();

resize();
plantGarden();
draw();

addEventListener('resize',()=>{
  resize();
  plantGarden();
});

// Entrada cinematográfica
const cinemaIntro =
  document.querySelector('#cinemaIntro');

document
  .querySelector('#enterUniverse')
  .addEventListener('click',()=>{
    document.body.classList.add('entered');
    cinemaIntro.classList.add('hidden');

    startMusic();

    sparkle(
      innerWidth/2,
      innerHeight/2,
      34
    );

    burstHearts(
      innerWidth/2,
      innerHeight/2
    );

    setTimeout(()=>{
      cinemaIntro.remove();
    },1400);
  });

// Frases románticas que cambian
const phrases = [
  'Sos luz incluso en mis noches más oscuras.',
  'Mi coincidencia favorita en todo el universo.',
  'Donde vos sonreís, siempre es primavera.',
  'Diez fotos, mil recuerdos y un solo corazón.'
];

let phraseIndex=0;

const changingPhrase =
  document.querySelector('#changingPhrase');

setInterval(()=>{
  if(
    !document.body.classList.contains('entered')
  ) {
    return;
  }

  changingPhrase.classList.add('change');

  setTimeout(()=>{
    phraseIndex =
      (phraseIndex+1)%phrases.length;

    changingPhrase.textContent =
      phrases[phraseIndex];

    changingPhrase.classList.remove('change');
  },500);
},4200);

// Estrellas fugaces
function shootingStar() {
  if(
    !document.body.classList.contains('entered')
  ) {
    return;
  }

  const star =
    document.createElement('i');

  star.className='shooting-star';

  star.style.setProperty(
    '--sx',
    (55+Math.random()*50)+'vw'
  );

  star.style.setProperty(
    '--sy',
    (2+Math.random()*35)+'vh'
  );

  document
    .querySelector('#shootingStars')
    .appendChild(star);

  setTimeout(()=>{
    star.remove();
  },1700);
}

setInterval(shootingStar,3000);

// Sorpresa final
const finale =
  document.querySelector('#finale');

document
  .querySelector('#finalSurprise')
  .addEventListener('click',()=>{
    finale.classList.add('open');

    finale.setAttribute(
      'aria-hidden',
      'false'
    );

    for(let i=0;i<7;i++) {
      setTimeout(()=>{
        burstHearts(
          innerWidth/2,
          innerHeight/2
        );
      },i*180);
    }
  });

document
  .querySelector('#finaleClose')
  .addEventListener('click',()=>{
    finale.classList.remove('open');

    finale.setAttribute(
      'aria-hidden',
      'true'
    );
  });

// Deslizar fotografías en celulares
let touchStart=0;

document
  .querySelector('.photo-stage')
  .addEventListener(
    'touchstart',
    e=>{
      touchStart =
        e.touches[0].clientX;
    },
    {passive:true}
  );

document
  .querySelector('.photo-stage')
  .addEventListener(
    'touchend',
    e=>{
      const distance =
        e.changedTouches[0].clientX-
        touchStart;

      if(Math.abs(distance)>45) {
        showPhoto(
          currentPhoto+
          (distance<0 ? 1 : -1)
        );
      }
    },
    {passive:true}
  );

// Luciérnagas
const fireflies =
  document.querySelector('#fireflies');

const fireflyTotal =
  innerWidth<760 ? 12 : 24;

for(let i=0;i<fireflyTotal;i++) {
  const firefly =
    document.createElement('i');

  firefly.className='firefly';

  firefly.style.left =
    (4+Math.random()*92)+'vw';

  firefly.style.top =
    (18+Math.random()*76)+'vh';

  firefly.style.setProperty(
    '--fx',
    (-70+Math.random()*140)+'px'
  );

  firefly.style.setProperty(
    '--fy',
    (-90+Math.random()*180)+'px'
  );

  firefly.style.setProperty(
    '--fd',
    (3+Math.random()*6)+'s'
  );

  firefly.style.animationDelay =
    (-Math.random()*6)+'s';

  fireflies.appendChild(firefly);
}

// Movimiento parallax
const cursorLight =
  document.querySelector('#cursorLight');

let targetX=innerWidth/2;
let targetY=innerHeight/2;
let currentX=targetX;
let currentY=targetY;

addEventListener('pointermove',e=>{
  targetX=e.clientX;
  targetY=e.clientY;

  const normalizedX =
    e.clientX/innerWidth-.5;

  const normalizedY =
    e.clientY/innerHeight-.5;

  document.querySelector(
    'main'
  ).style.transform =
    `translate(
      ${normalizedX*-7}px,
      ${normalizedY*-5}px
    )`;

  document.querySelector(
    '.aurora'
  ).style.translate =
    `${normalizedX*18}px ${normalizedY*12}px`;

  let nearest=null;
  let bestDistance=150;

  document
    .querySelectorAll('.bloom')
    .forEach(bloom=>{
      const rect =
        bloom.getBoundingClientRect();

      const distance =
        Math.hypot(
          e.clientX-
          (rect.left+rect.width/2),

          e.clientY-
          (rect.top+rect.height/2)
        );

      if(distance<bestDistance) {
        bestDistance=distance;
        nearest=bloom.parentElement;
      }
    });

  document
    .querySelectorAll('.flower.near')
    .forEach(flower=>{
      flower.classList.remove('near');
    });

  if(nearest) {
    nearest.classList.add('near');
  }
});

function animateCursor() {
  currentX +=
    (targetX-currentX)*.12;

  currentY +=
    (targetY-currentY)*.12;

  cursorLight.style.left =
    currentX+'px';

  cursorLight.style.top =
    currentY+'px';

  requestAnimationFrame(animateCursor);
}

animateCursor();

// Progreso de la canción
loveSong.addEventListener(
  'timeupdate',
  ()=>{
    if(loveSong.duration) {
      const progress =
        loveSong.currentTime/
        loveSong.duration*100;

      document
        .querySelector('#songProgress')
        .style.width =
          progress+'%';
    }
  }
);

// Navegación de la experiencia
const journeyButtons = [
  ...document.querySelectorAll(
    '.journey button'
  )
];

function setJourney(scene) {
  journeyButtons.forEach(button=>{
    button.classList.toggle(
      'active',
      button.dataset.scene===scene
    );
  });
}

document
  .querySelector('#reveal')
  .addEventListener('click',()=>{
    setJourney('letter');
  });

document
  .querySelector('.continue')
  .addEventListener('click',()=>{
    setJourney('memories');
  });

document
  .querySelector('#memoriesClose')
  .addEventListener('click',()=>{
    setJourney('home');
  });

document
  .querySelector('#finalSurprise')
  .addEventListener('click',()=>{
    setJourney('finale');
  });

document
  .querySelector('#finaleClose')
  .addEventListener('click',()=>{
    setJourney('memories');
  });

journeyButtons.forEach(button=>{
  button.addEventListener('click',()=>{
    const scene =
      button.dataset.scene;

    letter.classList.remove('open');
    memories.classList.remove('open');
    finale.classList.remove('open');

    if(scene==='letter') {
      letter.classList.add('open');
    }

    if(scene==='memories') {
      memories.classList.add('open');
      startPetals();
    }

    if(scene==='finale') {
      finale.classList.add('open');
    }

    setJourney(scene);
  });
});

// Visor de fotografías
const lightbox =
  document.querySelector('#lightbox');

const lightboxImage =
  document.querySelector('#lightboxImage');

const lightboxCaption =
  document.querySelector('#lightboxCaption');

function openLightbox() {
  const activePhoto =
    photos[currentPhoto];

  lightboxImage.src =
    activePhoto
      .querySelector('img')
      .src;

  lightboxCaption.textContent =
    activePhoto
      .querySelector('figcaption')
      .textContent;

  lightbox.classList.add('open');

  lightbox.setAttribute(
    'aria-hidden',
    'false'
  );
}

function closeLightbox() {
  lightbox.classList.remove('open');

  lightbox.setAttribute(
    'aria-hidden',
    'true'
  );
}

document
  .querySelector('#photoExpand')
  .addEventListener(
    'click',
    openLightbox
  );

document
  .querySelector('#lightboxClose')
  .addEventListener(
    'click',
    closeLightbox
  );

lightbox.addEventListener('click',e=>{
  if(e.target===lightbox) {
    closeLightbox();
  }
});

photos.forEach(photo=>{
  photo
    .querySelector('img')
    .addEventListener(
      'dblclick',
      openLightbox
    );
});

// Controles del teclado
addEventListener('keydown',e=>{
  if(
    memories.classList.contains('open') &&
    e.key==='ArrowRight'
  ) {
    showPhoto(currentPhoto+1);
  }

  if(
    memories.classList.contains('open') &&
    e.key==='ArrowLeft'
  ) {
    showPhoto(currentPhoto-1);
  }

  if(
    e.code==='Space' &&
    !e.repeat
  ) {
    e.preventDefault();

    isPlaying
      ? stopMusic()
      : startMusic();
  }

  if(e.key==='Escape') {
    closeLightbox();
    finale.classList.remove('open');
  }
});

// Mariposas doradas
const butterflies =
  document.querySelector('#butterflies');

for(let i=0;i<6;i++) {
  const butterfly =
    document.createElement('i');

  butterfly.className='butterfly';

  butterfly.style.setProperty(
    '--bx',
    (42+Math.random()*54)+'vw'
  );

  butterfly.style.setProperty(
    '--by',
    (45+Math.random()*42)+'vh'
  );

  butterfly.style.setProperty(
    '--bt',
    (7+Math.random()*6)+'s'
  );

  butterfly.style.setProperty(
    '--bd',
    (-Math.random()*9)+'s'
  );

  butterflies.appendChild(butterfly);
}

// Movimiento 3D de las fotografías
const photoStage =
  document.querySelector('.photo-stage');

photoStage.addEventListener(
  'pointermove',
  e=>{
    if(innerWidth<760) return;

    const rect =
      photoStage.getBoundingClientRect();

    const x =
      (e.clientX-rect.left)/
      rect.width-.5;

    const y =
      (e.clientY-rect.top)/
      rect.height-.5;

    photoStage.style.setProperty(
      '--tilt-x',
      (x*7)+'deg'
    );

    photoStage.style.setProperty(
      '--tilt-y',
      (y*-7)+'deg'
    );
  }
);

photoStage.addEventListener(
  'pointerleave',
  ()=>{
    photoStage.style.setProperty(
      '--tilt-x',
      '0deg'
    );

    photoStage.style.setProperty(
      '--tilt-y',
      '0deg'
    );
  }
);

// Mensaje final escrito letra por letra
const finalMessage =
  document.querySelector('#finalMessage');

let typingTimer;

function typeFinalMessage() {
  clearInterval(typingTimer);

  const text =
    finalMessage.dataset.text;

  let index=0;

  finalMessage.textContent='';

  typingTimer=setInterval(()=>{
    index++;

    finalMessage.textContent =
      text.slice(0,index);

    if(index>=text.length) {
      clearInterval(typingTimer);
    }
  },38);
}

// Lluvia de corazones, estrellas y girasoles
function magicRain(amount=70) {
  const symbols=[
    '♥',
    '♡',
    '✦',
    '•',
    '🌻'
  ];

  for(let i=0;i<amount;i++) {
    setTimeout(()=>{
      const drop =
        document.createElement('i');

      drop.className='magic-rain';

      drop.textContent =
        symbols[
          Math.floor(
            Math.random()*symbols.length
          )
        ];

      drop.style.setProperty(
        '--rx',
        Math.random()*100+'vw'
      );

      drop.style.setProperty(
        '--rs',
        (.55+Math.random()*1.2)+'rem'
      );

      drop.style.setProperty(
        '--rc',
        Math.random()>.24
          ? '#ffd83d'
          : '#ff6f91'
      );

      drop.style.setProperty(
        '--rt',
        (3.5+Math.random()*3)+'s'
      );

      drop.style.setProperty(
        '--rd',
        (-80+Math.random()*160)+'px'
      );

      document.body.appendChild(drop);

      setTimeout(()=>{
        drop.remove();
      },7000);
    },i*28);
  }
}

// Fuegos artificiales
const fireworks =
  document.querySelector('#fireworks');

const fctx =
  fireworks.getContext('2d');

let fireworkParticles=[];
let fireworksOn=false;
let fireworkTick=0;

function sizeFireworks() {
  const dpr =
    Math.min(devicePixelRatio,2);

  fireworks.width =
    innerWidth*dpr;

  fireworks.height =
    innerHeight*dpr;

  fireworks.style.width =
    innerWidth+'px';

  fireworks.style.height =
    innerHeight+'px';

  fctx.setTransform(
    dpr,
    0,
    0,
    dpr,
    0,
    0
  );
}

function explodeFirework() {
  const x =
    innerWidth*
    (.15+Math.random()*.7);

  const y =
    innerHeight*
    (.12+Math.random()*.45);

  const color =
    Math.random()>.25
      ? '255,214,49'
      : '255,103,139';

  for(let i=0;i<42;i++) {
    const angle =
      Math.PI*2*i/42+
      Math.random()*.08;

    const speed =
      1.2+Math.random()*3.2;

    fireworkParticles.push({
      x:x,
      y:y,
      vx:Math.cos(angle)*speed,
      vy:Math.sin(angle)*speed,
      life:1,
      color:color
    });
  }
}

function drawFireworks() {
  fctx.clearRect(
    0,
    0,
    innerWidth,
    innerHeight
  );

  if(
    fireworksOn &&
    fireworkTick++%42===0
  ) {
    explodeFirework();
  }

  fireworkParticles =
    fireworkParticles.filter(
      particle=>particle.life>.02
    );

  for(const particle of fireworkParticles) {
    particle.x+=particle.vx;
    particle.y+=particle.vy;
    particle.vy+=.018;
    particle.vx*=.992;
    particle.life*=.974;

    fctx.beginPath();

    fctx.fillStyle =
      `rgba(
        ${particle.color},
        ${particle.life}
      )`;

    fctx.shadowBlur=9;

    fctx.shadowColor =
      `rgb(${particle.color})`;

    fctx.arc(
      particle.x,
      particle.y,
      1.7,
      0,
      Math.PI*2
    );

    fctx.fill();
  }

  requestAnimationFrame(drawFireworks);
}

sizeFireworks();
drawFireworks();

addEventListener(
  'resize',
  sizeFireworks
);

document
  .querySelector('#finalSurprise')
  .addEventListener('click',()=>{
    fireworksOn=true;

    typeFinalMessage();
    magicRain(85);

    setTimeout(()=>{
      explodeFirework();
    },250);

    setTimeout(()=>{
      explodeFirework();
    },650);
  });

document
  .querySelector('#finaleClose')
  .addEventListener('click',()=>{
    fireworksOn=false;
    fireworkParticles=[];
  });

// Compartir la página
document
  .querySelector('#shareLove')
  .addEventListener('click',async()=>{
    const shareData={
      title:'Flores amarillas para vos',
      text:'Preparé este pequeño universo para vos 💛',
      url:location.href
    };

    try {
      if(navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(
          location.href
        );

        const label =
          document.querySelector(
            '#shareLove span'
          );

        const previousText =
          label.textContent;

        label.textContent =
          'Enlace copiado ✓';

        setTimeout(()=>{
          label.textContent =
            previousText;
        },2200);
      }
    } catch(error) {
      // Se cerró la ventana para compartir.
    }
  });