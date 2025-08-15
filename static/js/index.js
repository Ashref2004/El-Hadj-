window.addEventListener('scroll', function() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.getElementById('progressBar').style.width = scrolled + '%';
    
    if (window.pageYOffset > 300) {
      document.getElementById('backToTop').classList.add('show');
    } else {
      document.getElementById('backToTop').classList.remove('show');
    }
  });
  
  document.getElementById('backToTop').addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  const azkarSlides = [
    {
      text: "لبيك اللهم لبيك، لبيك لا شريك لك لبيك، إن الحمد والنعمة لك والملك، لا شريك لك",
      reference: "دعاء الإحرام"
    },
    {
      text: "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار",
      reference: "سورة البقرة - الآية 201"
    },
    {
      text: "سبحان الله والحمد لله ولا إله إلا الله والله أكبر ولا حول ولا قوة إلا بالله العلي العظيم",
      reference: "الأذكار العامة"
    },
    {
      text: "اللهم هذا البيت بيتك، والحرم حرمك، والأمن أمنك، وهذا مقام العائذ بك",
      reference: "دعاء عند الكعبة"
    },
    {
      text: "رب اغفر وارحم وأنت خير الراحمين، اللهم إني أسألك فعل الخيرات، وترك المنكرات، وحب المساكين",
      reference: "أدعية النبي صلى الله عليه وسلم"
    }
  ];

  const azkarSlide = document.querySelector('.azkar-slide');
  const zekrText = azkarSlide.querySelector('.zekr-text');
  const zekrReference = azkarSlide.querySelector('.zekr-reference');
  const dots = document.querySelectorAll('.azkar-dot');
  let currentIndex = 0;

  function showZekr(index) {
    gsap.to(azkarSlide, {
      opacity: 0,
      duration: 0.5,
      onComplete: function() {
        zekrText.textContent = azkarSlides[index].text;
        zekrReference.textContent = azkarSlides[index].reference;
        gsap.to(azkarSlide, { opacity: 1, duration: 0.5 });
      }
    });
    
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  setInterval(() => {
    currentIndex = (currentIndex + 1) % azkarSlides.length;
    showZekr(currentIndex);
  }, 5000);

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      showZekr(currentIndex);
    });
  });

  document.addEventListener('DOMContentLoaded', function() {
    const map = L.map('holySitesMap').setView([23.8859, 45.0792], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    const holySites = [
      {
        name: "مكة المكرمة",
        coords: [21.4225, 39.8262],
        color: "#e74c3c",
        description: "المسجد الحرام والكعبة المشرفة"
      },
      {
        name: "المدينة المنورة",
        coords: [24.4672, 39.6117],
        color: "#3498db",
        description: "المسجد النبوي الشريف"
      },
      {
        name: "جبل عرفة",
        coords: [21.3644, 40.0003],
        color: "#2ecc71",
        description: "موقع الوقوف في الحج"
      },
      {
        name: "منى",
        coords: [21.4133, 39.8933],
        color: "#f39c12",
        description: "موقع رمي الجمرات"
      },
      {
        name: "مزدلفة",
        coords: [21.3883, 39.9408],
        color: "#9b59b6",
        description: "موقع المبيت في الحج"
      }
    ];
    
    holySites.forEach(site => {
      const marker = L.circleMarker(site.coords, {
        radius: 10,
        fillColor: site.color,
        color: "#fff",
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
      }).addTo(map);
      
      marker.bindPopup(`
        <b>${site.name}</b><br>
        <small>${site.description}</small>
      `);
    });
    
    const mecca = holySites[0].coords;
    const medina = holySites[1].coords;
    const arafat = holySites[2].coords;
    const mina = holySites[3].coords;
    const muzdalifah = holySites[4].coords;
    
    L.polyline([mecca, medina], {color: 'rgba(52, 152, 219, 0.5)', weight: 3}).addTo(map);
    L.polyline([mecca, arafat], {color: 'rgba(46, 204, 113, 0.5)', weight: 3}).addTo(map);
    L.polyline([mecca, mina], {color: 'rgba(243, 156, 18, 0.5)', weight: 3}).addTo(map);
    L.polyline([mecca, muzdalifah], {color: 'rgba(155, 89, 182, 0.5)', weight: 3}).addTo(map);
    
    gsap.from(".animate__fadeIn", {
      opacity: 0,
      y: 50,
      duration: 1,
      stagger: 0.3,
      ease: "power2.out"
    });
    
    gsap.from(".animate__fadeInUp", {
      opacity: 0,
      y: 100,
      duration: 1,
      stagger: 0.2,
      ease: "back.out(1.7)",
      delay: 0.5
    });
    
    const icons = document.querySelectorAll('.nav-link i');
    
    icons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          scale: 1.4,
          rotate: 15,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)"
        });
      });
      
      icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          scale: 1,
          rotate: 0,
          duration: 0.5,
          ease: "back.out(1.7)"
        });
      });
    });
    
    const kaabaIcon = document.querySelector('.kaaba-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    setInterval(() => {
      gsap.to(kaabaIcon, {
        scale: 1.1,
        duration: 1,
        yoyo: true,
        repeat: 1,
        ease: "power1.inOut"
      });
    }, 8000);
    
    setInterval(() => {
      gsap.to(moonIcon, {
        scale: 1.2,
        duration: 1.5,
        yoyo: true,
        repeat: 1,
        ease: "elastic.out(1, 0.5)"
      });
    }, 12000);
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });