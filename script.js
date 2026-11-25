(function(){
  var doc=document,root=doc.documentElement,body=doc.body;
  root.classList.add('js');
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rnd(a,b){return a+Math.random()*(b-a)}
  function spark(box,i,x0,x1,y0,y1,size){
    var s=doc.createElement('span'),z=rnd(size[0],size[1]);
    s.className='spark'+(i%2?' c':'');
    s.style.cssText='left:'+rnd(x0,x1)+'%;top:'+rnd(y0,y1)+'%;width:'+z+'px;height:'+z+'px;animation-delay:'+rnd(0,4)+'s;animation-duration:'+rnd(3,6)+'s';
    box.appendChild(s);
  }
  // Brillos de la página y de la intro
  var sp=doc.getElementById('sparks'),ifx=doc.getElementById('ifx');
  for(var i=0;i<24;i++)spark(sp,i,0,100,0,100,[6,15]);
  for(i=0;i<18;i++)spark(ifx,i,40,60,60,78,[5,12]);
  for(i=0;i<8;i++)spark(ifx,i,5,95,6,50,[6,12]);
  // Burbujas del mar
  for(i=0;i<14;i++){
    var b=doc.createElement('span'),z=rnd(6,18);
    b.className='bub';
    b.style.cssText='left:'+rnd(2,98)+'%;width:'+z+'px;height:'+z+'px;animation-duration:'+rnd(6,12)+'s;animation-delay:'+rnd(0,8)+'s';
    ifx.appendChild(b);
  }

  // Entrar a la página
  var intro=doc.getElementById('intro');
  function enter(){
    intro.classList.add('leave');body.classList.add('ready');setTimeout(function(){[].forEach.call(doc.querySelectorAll('.me-grid>*'),function(e){e.classList.add('in')})},rm?0:600);
    body.classList.remove('lock');
    window.scrollTo(0,0);
    setTimeout(function(){intro.remove();layout();},rm?50:1500);
  }
  doc.getElementById('enter').addEventListener('click',enter);
  doc.getElementById('skip').addEventListener('click',enter);

  // Camino de olas
  var world=doc.getElementById('world'),
      base=doc.getElementById('base'),prog=doc.getElementById('prog'),g=doc.getElementById('g'),
      dusk=doc.getElementById('dusk'),scene=doc.getElementById('dscene'),L=0,H=0;
  for(i=0;i<46;i++)spark(doc.getElementById('stars'),i,0,100,0,100,[3,9]);
  function xAt(y,W){return W<820?26+6*Math.sin(y/70):W/2+34*Math.sin(y/110)}
  function clamp(v){return Math.max(0,Math.min(1,v))}
  function wtop(){return world.getBoundingClientRect().top+window.scrollY}
  function layout(){
    var W=world.clientWidth;H=world.clientHeight;
    var d='M'+xAt(0,W)+' 0';
    for(var y=8;y<=H;y+=8)d+=' L'+xAt(y,W).toFixed(1)+' '+y;
    base.setAttribute('d',d);prog.setAttribute('d',d);
    g.setAttribute('y2',H);
    L=prog.getTotalLength();prog.style.strokeDasharray=L;
    update();
  }
  function update(){
    var sy=window.scrollY;
    if(L){
      var p=clamp((sy+innerHeight*.6-wtop())/H);
      prog.style.strokeDashoffset=L*(1-p);
    }
    var q=clamp(-dusk.getBoundingClientRect().top/(dusk.offsetHeight-innerHeight));
    scene.style.setProperty('--p',q.toFixed(3));
    body.classList.toggle('night',q>.5);
    body.classList.toggle('night2',q>=1);
  }
  var tick=false;
  window.addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(function(){update();tick=false})}},{passive:true});
  window.addEventListener('resize',layout);
  if(doc.fonts&&doc.fonts.ready)doc.fonts.ready.then(layout);
  window.addEventListener('load',layout);

  // Las tarjetas aparecen al hacer scroll
  var els=[].slice.call(doc.querySelectorAll('.card'));
  [].slice.call(doc.querySelectorAll('.grid')).forEach(function(gr){
    [].slice.call(gr.children).forEach(function(c,k){var d=(k*110)+'ms';c.style.transitionDelay='0ms,0ms,'+d+','+d+','+d});
  });
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){var t=e.target;t.classList.add('in');io.unobserve(t);setTimeout(function(){t.style.transitionDelay=''},1600)}});
    },{threshold:.15});
    els.forEach(function(e){io.observe(e)});
  }else els.forEach(function(e){e.classList.add('in')});
})();