/* SIR Gardens — edit CONTACT_EMAIL before publishing. */
const CONTACT_EMAIL = "info@sirgaedens.com";

const seasons = {
  spring: {image:'assets/spring.webp', title:'A garden that feels<br><em>like it was always yours.</em>', copy:'Thoughtful design, beautiful planting and considered details — creating outdoor spaces to live in, grow with and love.', index:'01',particle:'petal',color:'#f1c5d1',inspirationTitle:'A fresh beginning<br>in every corner.',inspirationDesc:'Blossom, fresh greens and a garden waking up to possibility.'},
  summer: {image:'assets/summer.webp', title:'Make room for<br><em>long, golden days.</em>', copy:'From peaceful morning coffee to evenings spent outside, create a garden that becomes your favourite place to be.', index:'02',particle:'sun',color:'#f1d991',inspirationTitle:'Your own summer<br>sanctuary.',inspirationDesc:'Soft shade, generous greenery and outdoor spaces made for living.'},
  autumn: {image:'assets/autumn.webp', title:'A garden dressed<br><em>in golden light.</em>', copy:'Rich textures, beautiful structure and warm seasonal colour bring a quieter kind of magic to the garden.', index:'03',particle:'leaf',color:'#e3ad75',inspirationTitle:'A golden hour<br>that lasts.',inspirationDesc:'Rich foliage, gentle light and a garden that feels wonderfully tucked away.'},
  winter: {image:'assets/winter.webp', title:'Beauty in every<br><em>quiet moment.</em>', copy:'Sculptural forms, evergreen structure and thoughtful lighting keep your garden captivating through the colder months.', index:'04',particle:'snow',color:'#e1edf3',inspirationTitle:'The quiet beauty<br>of winter.',inspirationDesc:'Evergreen forms, subtle lighting and a little stillness outdoors.'}
};
const heroMedia=document.getElementById('hero-media');
const imageA=document.getElementById('hero-image-a');
const imageB=document.getElementById('hero-image-b');
let activeImage=imageA;
let nextImage=imageB;
let currentSeason='spring';
let autoTimer=null;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function makeParticles(season){
  const holder=document.getElementById('season-particles');
  holder.innerHTML='';
  if(reducedMotion) return;
  const count=season==='winter'?22:season==='autumn'?13:season==='spring'?12:8;
  for(let i=0;i<count;i++){
    const p=document.createElement('span');
    p.className=`particle ${seasons[season].particle}`;
    p.style.setProperty('--x',`${Math.random()*100}%`);
    p.style.setProperty('--duration',`${season==='winter'?9+Math.random()*9:12+Math.random()*13}s`);
    p.style.setProperty('--delay',`${-Math.random()*20}s`);
    p.style.setProperty('--drift',`${Math.random()*140-70}px`);
    p.style.setProperty('--size',`${season==='winter'?8+Math.random()*7:10+Math.random()*12}px`);
    p.style.setProperty('--particle-color',seasons[season].color);
    holder.appendChild(p);
  }
}
function setSeason(name,manual=false){
  if(!seasons[name]||name===currentSeason) return;
  currentSeason=name;
  const s=seasons[name];
  const preload=new Image();
  preload.onload=()=>{
    nextImage.src=s.image;
    nextImage.alt=`${name} garden inspiration`;
    nextImage.classList.add('is-active');
    activeImage.classList.remove('is-active');
    const old=activeImage;activeImage=nextImage;nextImage=old;
    heroMedia.dataset.season=name;
  };
  preload.src=s.image;
  document.getElementById('hero-title').innerHTML=s.title;
  document.getElementById('hero-copy').textContent=s.copy;
  document.getElementById('season-index').textContent=s.index;
  document.getElementById('inspiration-season').textContent=`THE ${name.toUpperCase()} EDIT`;
  document.getElementById('inspiration-title').innerHTML=s.inspirationTitle;
  document.getElementById('inspiration-desc').textContent=s.inspirationDesc;
  const insp=document.getElementById('inspiration-image');
  insp.style.opacity='0.25';
  window.setTimeout(()=>{insp.src=s.image;insp.alt=`${name} garden scene`;insp.style.opacity='1';},250);
  document.querySelectorAll('[data-season]').forEach(button=>{
    if(button.classList.contains('season-button')){
      const selected=button.dataset.season===name;
      button.classList.toggle('is-selected',selected);
      button.setAttribute('aria-pressed',String(selected));
    }
  });
  makeParticles(name);
  if(manual) restartAuto();
}
function restartAuto(){
  if(autoTimer) clearInterval(autoTimer);
  if(!reducedMotion) autoTimer=setInterval(()=>{
    const keys=Object.keys(seasons);const i=keys.indexOf(currentSeason);
    setSeason(keys[(i+1)%keys.length]);
  },9000);
}
document.querySelectorAll('.season-button,.season-card').forEach(button=>button.addEventListener('click',()=>setSeason(button.dataset.season,true)));
document.getElementById('inspiration-next').addEventListener('click',()=>{
  const keys=Object.keys(seasons);const i=keys.indexOf(currentSeason);setSeason(keys[(i+1)%keys.length],true);
});
makeParticles('spring');restartAuto();

const menuButton=document.querySelector('.menu-toggle');
const nav=document.getElementById('main-nav');
menuButton.addEventListener('click',()=>{
  const open=menuButton.getAttribute('aria-expanded')!=='true';
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
  nav.classList.toggle('is-open',open);
});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  nav.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Open navigation');
}));

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target);}
}),{threshold:.12});
document.querySelectorAll('.intro-kicker,.intro-grid,.season-card,.statement-inner,.section-heading,.service-item,.approach-image,.approach-content,.inspiration-head,.inspiration-feature,.contact-top,.contact-form').forEach(el=>{
  el.classList.add('reveal');revealObserver.observe(el);
});

document.getElementById('year').textContent=new Date().getFullYear();
document.getElementById('contact-form').addEventListener('submit',event=>{
  event.preventDefault();
  if(!CONTACT_EMAIL.trim()){
    document.getElementById('form-note').textContent='Your email application will open with your enquiry addressed to info@sirgaedens.com.';
    return;
  }
  const data=new FormData(event.currentTarget);
  const subject=encodeURIComponent(`Garden enquiry — ${data.get('project')}`);
  const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\nProject: ${data.get('project')}\n\nGarden details:\n${data.get('message')}`);
  window.location.href=`mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
});
