(function(){
  var box=document.getElementById('player'); if(!box) return;
  var btn=document.querySelector('.music-toggle'), au=box.querySelector('audio');
  var items=[].slice.call(box.querySelectorAll('.pl-list button'));
  var play=box.querySelector('.pl-play'), seek=box.querySelector('.pl-seek');
  var tt=box.querySelector('.pl-title'), ar=box.querySelector('.pl-artist');
  var cur=0, K='music';
  function get(){try{return JSON.parse(localStorage.getItem(K))||{}}catch(e){return {}}}
  function put(o){try{localStorage.setItem(K,JSON.stringify(o))}catch(e){}}
  function load(i,t){
    cur=(i+items.length)%items.length; var b=items[cur];
    au.src=b.dataset.src; tt.textContent=b.dataset.title; ar.textContent=b.dataset.artist;
    items.forEach(function(x,j){x.classList.toggle('on',j===cur)});
    if(t){au.addEventListener('loadedmetadata',function f(){au.currentTime=t;au.removeEventListener('loadedmetadata',f)})}
  }
  function ui(){var p=!au.paused;play.textContent=p?'❚❚':'▶';btn.classList.toggle('playing',p)}
  var s=get(); load(s.i||0,s.t||0);
  if(s.open){box.hidden=false;btn.setAttribute('aria-expanded','true')}
  btn.addEventListener('click',function(){
    box.hidden=!box.hidden; btn.setAttribute('aria-expanded',String(!box.hidden));
    var o=get();o.open=!box.hidden;put(o);
  });
  play.addEventListener('click',function(){au.paused?au.play():au.pause()});
  box.querySelector('[data-a=prev]').addEventListener('click',function(){load(cur-1);au.play()});
  box.querySelector('[data-a=next]').addEventListener('click',function(){load(cur+1);au.play()});
  items.forEach(function(b,j){b.addEventListener('click',function(){load(j);au.play()})});
  au.addEventListener('play',ui);au.addEventListener('pause',ui);
  au.addEventListener('ended',function(){load(cur+1);au.play()});
  au.addEventListener('timeupdate',function(){
    if(au.duration)seek.value=Math.round(au.currentTime/au.duration*1000);
    var o=get();o.i=cur;o.t=au.currentTime;put(o);
  });
  seek.addEventListener('input',function(){if(au.duration)au.currentTime=seek.value/1000*au.duration});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!box.hidden)btn.click()});
})();
