(function(){
    var sections = document.querySelectorAll('main section[id]');
    var sideLinks = document.querySelectorAll('.filetree a');
    var topLinks = document.querySelectorAll('.topnav a');
    var indicator = document.getElementById('navIndicator');

    function setActive(id){
      sideLinks.forEach(function(a){
        var isActive = a.getAttribute('href') === '#' + id;
        a.classList.toggle('active', isActive);
        if(isActive && indicator){
          indicator.style.top = a.offsetTop + 'px';
          indicator.style.height = a.offsetHeight + 'px';
        }
      });
      topLinks.forEach(function(a){
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }

    var sectionObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){ setActive(entry.target.id); }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    sections.forEach(function(s){ sectionObserver.observe(s); });

    var revealEls = document.querySelectorAll('.reveal');
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function(el){ revealObserver.observe(el); });

    var pills = document.querySelectorAll('.skill-pill');
    var pillObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          pillObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    pills.forEach(function(p){ pillObserver.observe(p); });

    document.getElementById('year').textContent = new Date().getFullYear();

    window.addEventListener('load', function(){ setActive('inicio'); });
  })();