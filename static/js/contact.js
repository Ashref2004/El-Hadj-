document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('particles-js')) {
      particlesJS('particles-js', {
        "particles": {
          "number": {
            "value": 80,
            "density": {
              "enable": true,
              "value_area": 800
            }
          },
          "color": {
            "value": "#C19A3F"
          },
          "shape": {
            "type": "circle",
            "stroke": {
              "width": 0,
              "color": "#000000"
            },
            "polygon": {
              "nb_sides": 5
            }
          },
          "opacity": {
            "value": 0.5,
            "random": false,
            "anim": {
              "enable": false,
              "speed": 1,
              "opacity_min": 0.1,
              "sync": false
            }
          },
          "size": {
            "value": 3,
            "random": true,
            "anim": {
              "enable": false,
              "speed": 40,
              "size_min": 0.1,
              "sync": false
            }
          },
          "line_linked": {
            "enable": true,
            "distance": 150,
            "color": "#C19A3F",
            "opacity": 0.4,
            "width": 1
          },
          "move": {
            "enable": true,
            "speed": 2,
            "direction": "none",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
            "attract": {
              "enable": false,
              "rotateX": 600,
              "rotateY": 1200
            }
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": true,
              "mode": "grab"
            },
            "onclick": {
              "enable": true,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 140,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      });
    }
  });
  
  (function() {
    'use strict';
    
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    window.addEventListener('scroll', function() {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      document.getElementById('progressBar').style.width = scrolled + '%';
    });
    
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        document.querySelector('.navbar').classList.add('scrolled');
      } else {
        document.querySelector('.navbar').classList.remove('scrolled');
      }
    });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
    
    function showSuccessMessage() {
      const successMessage = document.getElementById('successMessage');
      successMessage.classList.add('active');
      
      gsap.from(successMessage, {
        duration: 0.5,
        scale: 0.5,
        opacity: 0,
        ease: "back.out(1.7)"
      });
    }
    
    document.getElementById('closeSuccessMessage').addEventListener('click', function() {
      const successMessage = document.getElementById('successMessage');
      gsap.to(successMessage, {
        duration: 0.3,
        scale: 0.8,
        opacity: 0,
        ease: "back.in(1.7)",
        onComplete: function() {
          successMessage.classList.remove('active');
        }
      });
    });
    
    document.querySelector('.success-message .btn-close').addEventListener('click', function() {
      const successMessage = document.getElementById('successMessage');
      gsap.to(successMessage, {
        duration: 0.3,
        scale: 0.8,
        opacity: 0,
        ease: "back.in(1.7)",
        onComplete: function() {
          successMessage.classList.remove('active');
        }
      });
    });
    
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', function(event) {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        
        document.getElementById('loader').classList.add('active');
        
        setTimeout(function() {
          document.getElementById('loader').classList.remove('active');
          
          showSuccessMessage();
          
          form.reset();
          form.classList.remove('was-validated');
          
          document.querySelectorAll('.form-control').forEach(input => {
            if (input.value === '') {
              input.nextElementSibling.classList.remove('active');
            }
          });
        }, 2000);
      }
      
      form.classList.add('was-validated');
    }, false);
    
    const animateOnScroll = function() {
      const elements = document.querySelectorAll('.animate__animated');
      const windowHeight = window.innerHeight;
      
      elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementPosition < windowHeight - elementVisible) {
          const animationClass = element.getAttribute('data-animate');
          if (animationClass && !element.classList.contains(animationClass)) {
            element.classList.add(animationClass);
            
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
    
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
    
    document.querySelectorAll('.form-control').forEach(input => {
      input.addEventListener('focus', function() {
        this.nextElementSibling.classList.add('active');
      });
      
      input.addEventListener('blur', function() {
        if (this.value === '') {
          this.nextElementSibling.classList.remove('active');
        }
      });
      
      if (input.value !== '') {
        input.nextElementSibling.classList.add('active');
      }
    });
    
    document.addEventListener('DOMContentLoaded', function() {
      const headerTitle = document.querySelector('.contact-header h1');
      setInterval(function() {
        headerTitle.classList.toggle('glow-text');
      }, 2000);
      
      const socialLinks = document.querySelectorAll('.social-links a');
      socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
          gsap.to(link, {
            duration: 0.3,
            scale: 1.1,
            ease: "back.out(1.7)"
          });
        });
        
        link.addEventListener('mouseleave', function() {
          gsap.to(link, {
            duration: 0.3,
            scale: 1,
            ease: "back.out(1.7)"
          });
        });
      });
      
      const scrollToFormBtn = document.querySelector('.scroll-to-form');
      if (scrollToFormBtn) {
        scrollToFormBtn.addEventListener('click', function(e) {
          e.preventDefault();
          const formSection = document.getElementById('contactForm');
          if (formSection) {
            window.scrollTo({
              top: formSection.offsetTop - 100,
              behavior: 'smooth'
            });
            
            gsap.to(formSection, {
              duration: 0.5,
              x: 10,
              ease: "elastic.out(1, 0.5)",
              repeat: 1,
              yoyo: true
            });
          }
        });
      }
    });
  })();