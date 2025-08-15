document.getElementById('currentYear').textContent = new Date().getFullYear();
    
window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('loader').style.opacity = '0';
    setTimeout(function() {
      document.getElementById('loader').style.display = 'none';
    }, 500);
  }, 1000);
  
  document.body.style.opacity = '1';
});

window.addEventListener('scroll', function() {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.getElementById('progressBar').style.width = scrolled + '%';
  
  if (window.pageYOffset > 300) {
    document.getElementById('backToTop').classList.add('active');
  } else {
    document.getElementById('backToTop').classList.remove('active');
  }
});

document.getElementById('backToTop').addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

document.getElementById('shareBtn').addEventListener('click', function() {
  if (navigator.share) {
    navigator.share({
      title: 'مناسك الحج',
      text: 'تعرف على مناسك الحج خطوة بخطوة',
      url: window.location.href
    }).catch(err => {
      console.error('Error sharing:', err);
    });
  } else {
    alert('مشاركة الصفحة غير متاحة في هذا المتصفح. يمكنك نسخ الرابط يدوياً.');
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const mawaqitMap = L.map('mawaqitMap').setView([24.7136, 39.1841], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(mawaqitMap);
  
  const mawaqit = [
    {name: 'ذو الحليفة (أهل المدينة)', coords: [24.4333, 39.6167], color: '#e74c3c'},
    {name: 'الجحفة (أهل الشام)', coords: [22.8025, 39.0658], color: '#3498db'},
    {name: 'قرن المنازل (أهل نجد)', coords: [21.3500, 40.4667], color: '#2ecc71'},
    {name: 'يلملم (أهل اليمن)', coords: [18.3333, 42.7667], color: '#f39c12'},
    {name: 'ذات عرق (أهل العراق)', coords: [21.0500, 41.4667], color: '#9b59b6'}
  ];
  
  mawaqit.forEach(miqat => {
    L.circleMarker(miqat.coords, {
      radius: 8,
      fillColor: miqat.color,
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(mawaqitMap)
      .bindPopup(`<b>${miqat.name}</b><br>ميقات إحرام`);
  });
  
  const hajjMap = L.map('hajjMap').setView([21.3891, 39.8579], 11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(hajjMap);
  
  const hajjLocations = [
    {name: 'المسجد الحرام', coords: [21.4225, 39.8262], color: '#e74c3c'},
    {name: 'منى', coords: [21.4130, 39.8930], color: '#3498db'},
    {name: 'عرفة', coords: [21.3644, 40.0000], color: '#2ecc71'},
    {name: 'مزدلفة', coords: [21.3844, 39.9422], color: '#f39c12'},
    {name: 'جمرات منى', coords: [21.4233, 39.8683], color: '#9b59b6'}
  ];
  
  hajjLocations.forEach(location => {
    L.circleMarker(location.coords, {
      radius: 8,
      fillColor: location.color,
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(hajjMap)
      .bindPopup(`<b>${location.name}</b><br>مكان أداء مناسك الحج`);
  });
  
  const haramMap = L.map('haramMap').setView([21.4225, 39.8262], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(haramMap);
  
  const haramLocations = [
    {name: 'الكعبة المشرفة', coords: [21.4225, 39.8262], color: '#e74c3c'},
    {name: 'الحجر الأسود', coords: [21.4225, 39.8262], color: '#3498db'},
    {name: 'مقام إبراهيم', coords: [21.4225, 39.8261], color: '#2ecc71'},
    {name: 'الصفا والمروة', coords: [21.4229, 39.8258], color: '#f39c12'},
    {name: 'بئر زمزم', coords: [21.4226, 39.8264], color: '#9b59b6'}
  ];
  
  haramLocations.forEach(location => {
    L.circleMarker(location.coords, {
      radius: 8,
      fillColor: location.color,
      color: '#fff',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(haramMap)
      .bindPopup(`<b>${location.name}</b><br>معلم في المسجد الحرام`);
  });
  
  const animateElements = document.querySelectorAll('.animate__animated');
  
  const animateOnScroll = function() {
    animateElements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      if (elementPosition < windowHeight - 100) {
        const animationClass = Array.from(element.classList).find(className => 
          className.startsWith('animate__') && 
          !className.endsWith('animated')
        );
        
        if (animationClass) {
          element.style.opacity = '1';
          element.classList.add(animationClass);
        }
      }
    });
  };
  
  animateOnScroll();
  
  window.addEventListener('scroll', animateOnScroll);
  
  const stepCards = document.querySelectorAll('.step-card .card-header');
  stepCards.forEach(header => {
    header.addEventListener('click', function() {
      const icon = this.querySelector('.toggle-icon');
      const body = document.querySelector(this.getAttribute('data-bs-target'));
      
      if (body.classList.contains('show')) {
        icon.style.transform = 'translateY(-50%) rotate(-90deg)';
      } else {
        icon.style.transform = 'translateY(-50%) rotate(0deg)';
      }
    });
  });

  if(window.location.hash === '#dua') {
    const duaTab = document.querySelector('#dua-tab');
    const tab = new bootstrap.Tab(duaTab);
    tab.show();
  }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if(targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if(targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: 'smooth'
      });

      if(targetId === '#dua') {
        const duaTab = document.querySelector('#dua-tab');
        const tab = new bootstrap.Tab(duaTab);
        tab.show();
      }
    }
  });
});

function copyToClipboard(element) {
  const text = element.innerText;
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  
  const originalText = event.target.innerHTML;
  event.target.innerHTML = '<i class="fas fa-check"></i> تم النسخ!';
  
  setTimeout(() => {
    event.target.innerHTML = originalText;
  }, 2000);
}

window.addEventListener('beforeunload', function() {
  const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
  localStorage.setItem('hajjPageScrollPosition', scrollPosition);
});

window.addEventListener('load', function() {
  const savedPosition = localStorage.getItem('hajjPageScrollPosition');
  if (savedPosition) {
    window.scrollTo({
      top: savedPosition,
      behavior: 'auto'
    });
    localStorage.removeItem('hajjPageScrollPosition');
  }
});