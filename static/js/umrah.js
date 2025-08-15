document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        992: {
          slidesPerView: 3,
        }
      }
    });
    
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

    document.getElementById('shareBtn').addEventListener('click', function() {
      if (navigator.share) {
        navigator.share({
          title: 'مناسك العمرة',
          text: 'تعرف على مناسك العمرة خطوة بخطوة',
          url: window.location.href
        }).catch(err => {
          console.error('Error sharing:', err);
        });
      } else {
        alert('يمكنك مشاركة الرابط يدوياً: ' + window.location.href);
      }
    });

    document.querySelectorAll('.ripple').forEach(button => {
      button.addEventListener('click', function(e) {
        const x = e.clientX - e.target.getBoundingClientRect().left;
        const y = e.clientY - e.target.getBoundingClientRect().top;
        
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });

    document.addEventListener('DOMContentLoaded', function() {
      const mawaqitMap = L.map('mawaqitMap').setView([23.8859, 45.0792], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mawaqitMap);
      
      const mawaqit = [
        {
          name: 'ذو الحليفة (أهل المدينة)',
          coords: [24.4333, 39.6167],
          color: '#e74c3c',
          description: 'يقع شمال المدينة المنورة، ويعرف اليوم بأبيار علي'
        },
        {
          name: 'الجحفة (أهل الشام ومصر والمغرب)',
          coords: [22.8025, 39.0658],
          color: '#3498db',
          description: 'قرية قديمة بين مكة والمدينة، قرب رابغ'
        },
        {
          name: 'قرن المنازل (أهل نجد)',
          coords: [21.3500, 40.4667],
          color: '#2ecc71',
          description: 'يعرف اليوم بالسيل الكبير، شرق مكة'
        },
        {
          name: 'يلملم (أهل اليمن)',
          coords: [18.3333, 42.7667],
          color: '#f39c12',
          description: 'وادي جنوب مكة، قرب مدينة الليث'
        },
        {
          name: 'ذات عرق (أهل العراق)',
          coords: [21.0500, 41.4667],
          color: '#9b59b6',
          description: 'موقع شمال شرق مكة، قرب مدينة الطائف'
        }
      ];
      
      mawaqit.forEach(miqat => {
        const marker = L.circleMarker(miqat.coords, {
          radius: 8,
          fillColor: miqat.color,
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(mawaqitMap);
        
        marker.bindPopup(`
          <b>${miqat.name}</b><br>
          <small>${miqat.description}</small><br>
          <small>الإحداثيات: ${miqat.coords[0]}, ${miqat.coords[1]}</small>
        `);
      });
      
      const meccaCoords = [21.4225, 39.8262];
      mawaqit.forEach(miqat => {
        L.polyline([miqat.coords, meccaCoords], {
          color: miqat.color,
          weight: 1,
          opacity: 0.5,
          dashArray: '5, 5'
        }).addTo(mawaqitMap);
      });
      
      L.circleMarker(meccaCoords, {
        radius: 10,
        fillColor: '#e74c3c',
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 1
      }).addTo(mawaqitMap).bindPopup('<b>مكة المكرمة</b><br>المسجد الحرام');
      
      const haramMap = L.map('haramMap').setView([21.4225, 39.8262], 17);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(haramMap);
      
      const haramLocations = [
        {
          name: 'الكعبة المشرفة',
          coords: [21.4225, 39.8262],
          color: '#e74c3c',
          description: 'بيت الله الحرام، قبلة المسلمين'
        },
        {
          name: 'الحجر الأسود',
          coords: [21.4225, 39.8262],
          color: '#3498db',
          description: 'يبدأ منه الطواف وينتهي إليه'
        },
        {
          name: 'مقام إبراهيم',
          coords: [21.4225, 39.8261],
          color: '#2ecc71',
          description: 'الحجر الذي وقف عليه إبراهيم عليه السلام'
        },
        {
          name: 'الصفا',
          coords: [21.4229, 39.8258],
          color: '#f39c12',
          description: 'يبدأ منه السعي بين الصفا والمروة'
        },
        {
          name: 'المروة',
          coords: [21.4231, 39.8266],
          color: '#f39c12',
          description: 'ينتهي إليه السعي بين الصفا والمروة'
        }
      ];
      
      haramLocations.forEach(location => {
        L.circleMarker(location.coords, {
          radius: 8,
          fillColor: location.color,
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(haramMap).bindPopup(`
          <b>${location.name}</b><br>
          <small>${location.description}</small>
        `);
      });
      
      L.polyline([
        [21.4229, 39.8258], 
        [21.4230, 39.8260],
        [21.4230, 39.8262],
        [21.4231, 39.8264],
        [21.4231, 39.8266]  
      ], {
        color: '#f39c12',
        weight: 2,
        dashArray: '5, 5'
      }).addTo(haramMap);

      const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate__animated');
        
        elements.forEach(element => {
          const elementPosition = element.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          
          if (elementPosition < windowHeight - 100) {
            const animationClass = element.dataset.animate;
            if (animationClass && !element.classList.contains(animationClass)) {
              element.classList.add(animationClass);
              
              // تأثيرات GSAP إضافية
              if (animationClass.includes('fadeInUp')) {
                gsap.from(element, {
                  duration: 0.8,
                  y: 50,
                  opacity: 0,
                  ease: "power2.out"
                });
              } else if (animationClass.includes('fadeIn')) {
                gsap.from(element, {
                  duration: 1,
                  opacity: 0,
                  ease: "power2.out"
                });
              }
            }
          }
        });
      };
      
      animateOnScroll();
      window.addEventListener('scroll', animateOnScroll);
      
      const stepHeaders = document.querySelectorAll('.step-card .card-header');
      stepHeaders.forEach(header => {
        header.addEventListener('click', function() {
          const icon = this.querySelector('.toggle-icon');
          if (this.classList.contains('collapsed')) {
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
      
      const headerTitle = document.querySelector('.page-header h1');
      setInterval(function() {
        headerTitle.classList.toggle('glow-text');
      }, 2000);
      
      document.querySelectorAll('.icon-box').forEach(box => {
        box.addEventListener('mouseenter', function() {
          gsap.to(this, {
            duration: 0.3,
            scale: 1.1,
            ease: "back.out(1.7)"
          });
        });
        
        box.addEventListener('mouseleave', function() {
          gsap.to(this, {
            duration: 0.3,
            scale: 1,
            ease: "back.out(1.7)"
          });
        });
      });
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
          
          if (targetId === '#dua') {
            const duaTab = document.querySelector('#dua-tab');
            const tab = new bootstrap.Tab(duaTab);
            tab.show();
          }
        }
      });
    });
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
      } else {
        document.querySelector('.navbar').classList.remove('scrolled');
      }
    });