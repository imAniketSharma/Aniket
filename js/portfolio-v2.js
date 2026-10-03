(function(){
  var header=document.getElementById('site-header');
  var progress=document.getElementById('progress-bar');
  var toggle=document.getElementById('menu-toggle');
  var nav=document.getElementById('site-nav');
  var links=[].slice.call(document.querySelectorAll('.site-nav a[href^="#"]'));
  var sections=[].slice.call(document.querySelectorAll('main section[id]'));

  function onScroll(){
    var y=window.scrollY||window.pageYOffset;
    header.classList.toggle('scrolled',y>20);
    var max=document.documentElement.scrollHeight-window.innerHeight;
    progress.style.width=(max>0?Math.min(100,(y/max)*100):0)+'%';
  }
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  toggle.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded',String(open));
  });
  links.forEach(function(link){link.addEventListener('click',function(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');});});

  var observer=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){if(entry.isIntersecting)entry.target.classList.add('is-visible');});
  },{threshold:.12});
  document.querySelectorAll('.reveal').forEach(function(el){observer.observe(el);});

  var sectionObserver=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(!entry.isIntersecting)return;
      var id=entry.target.id;
      links.forEach(function(link){link.classList.toggle('active',link.getAttribute('href')==='#'+id);});
    });
  },{rootMargin:'-35% 0px -55% 0px',threshold:0});
  sections.forEach(function(section){sectionObserver.observe(section);});
})();

// Technical expertise carousel — responsive, horizontal and circular (infinite loop).
(function(){
  var root=document.querySelector('[data-expertise-carousel]');
  if(!root)return;
  var track=root.querySelector('[data-expertise-track]');
  var originalCards=[].slice.call(track.children);
  var dots=root.querySelector('[data-expertise-dots]');
  var prev=root.querySelector('[data-expertise-prev]');
  var next=root.querySelector('[data-expertise-next]');
  var index=0;
  var perPage=4;
  var pages=1;
  var timer=null;
  var isReduced=window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var locked=false;

  function getPerPage(){
    if(window.innerWidth<=760)return 1;
    if(window.innerWidth<=1000)return 2;
    return 4;
  }

  function cloneCards(){
    track.innerHTML='';
    originalCards.forEach(function(card){track.appendChild(card);});
    originalCards.forEach(function(card){
      var clone=card.cloneNode(true);
      clone.setAttribute('aria-hidden','true');
      track.appendChild(clone);
    });
  }

  function renderDots(){
    dots.innerHTML='';
    for(var i=0;i<pages;i++){
      var dot=document.createElement('button');
      dot.type='button';
      dot.className='expertise-dot'+(i===index%pages?' is-active':'');
      dot.setAttribute('aria-label','Go to expertise slide '+(i+1));
      dot.addEventListener('click',(function(n){return function(){goTo(n*perPage);};})(i));
      dots.appendChild(dot);
    }
  }

  function cardStep(){
    var first=track.children[0];
    if(!first)return 0;
    var gap=parseFloat(getComputedStyle(track).gap)||0;
    return first.getBoundingClientRect().width+gap;
  }

  function applyTransform(instant){
    track.style.transitionDuration=instant?'0s':'';
    track.style.transform='translate3d(-'+(cardStep()*index)+'px,0,0)';
    [].slice.call(dots.children).forEach(function(dot,i){dot.classList.toggle('is-active',i===index%pages);});
  }

  function goTo(n, instant){
    if(locked)return;
    index=Math.max(0,n);
    applyTransform(!!instant);
    if(!instant){
      locked=true;
      setTimeout(function(){
        if(index>=originalCards.length){
          index=index-originalCards.length;
          applyTransform(true);
        }
        locked=false;
      },520);
    }
  }

  function nextCard(){goTo(index+1);}
  function prevCard(){
    if(index<=0){
      index=originalCards.length;
      applyTransform(true);
    }
    goTo(index-1);
  }

  function startAuto(){
    if(isReduced)return;
    clearInterval(timer);
    timer=setInterval(nextCard,3400);
  }
  function stopAuto(){clearInterval(timer);}

  function setup(){
    stopAuto();
    perPage=getPerPage();
    pages=Math.max(1,Math.ceil(originalCards.length/perPage));
    index=0;
    cloneCards();
    renderDots();
    applyTransform(true);
    startAuto();
  }

  prev.addEventListener('click',function(){stopAuto();prevCard();startAuto();});
  next.addEventListener('click',function(){stopAuto();nextCard();startAuto();});
  root.addEventListener('mouseenter',stopAuto);
  root.addEventListener('mouseleave',startAuto);
  root.addEventListener('focusin',stopAuto);
  root.addEventListener('focusout',function(){if(!root.contains(document.activeElement))startAuto();});

  var resizeTimer;
  window.addEventListener('resize',function(){clearTimeout(resizeTimer);resizeTimer=setTimeout(setup,120);});
  setup();
})();
