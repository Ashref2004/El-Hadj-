window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
      backToTop.classList.add('active');
    } else {
      backToTop.classList.remove('active');
    }
  });

  document.addEventListener('DOMContentLoaded', function() {
    const icons = document.querySelectorAll('.nav-link i, .category-icon');
    
    icons.forEach(icon => {
      icon.addEventListener('mouseenter', () => {
        icon.classList.add('animate__animated', 'animate__swing');
        setTimeout(() => {
          icon.classList.remove('animate__animated', 'animate__swing');
        }, 1000);
      });
    });
    
    setTimeout(() => {
      document.body.style.opacity = '1';
    }, 100);
  });
  
  function copyToClipboard(element) {
    const text = element.innerText;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    
    const originalText = event.target.querySelector('span').innerHTML;
    event.target.querySelector('span').innerHTML = 'تم النسخ!';
    event.target.querySelector('i').className = 'fas fa-check';
    
    setTimeout(() => {
      event.target.querySelector('span').innerHTML = originalText;
      event.target.querySelector('i').className = 'far fa-copy';
    }, 2000);
  }
  
  document.querySelector('.back-to-top').addEventListener('click', function(e) {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
  
  document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
    
    if (searchTerm === '') {
      alert('الرجاء إدخال كلمة للبحث');
      return;
    }
    
    document.querySelectorAll('.accordion-item').forEach(item => {
      item.style.display = 'block';
    });
    
    document.querySelectorAll('.accordion-collapse').forEach(collapse => {
      collapse.classList.remove('show');
    });
    
    document.querySelectorAll('.dua-container').forEach(dua => {
      dua.style.display = 'block';
    });
    
    let found = false;
    
    document.querySelectorAll('.dua-container').forEach(dua => {
      const keywords = dua.getAttribute('data-keywords').toLowerCase();
      const duaText = dua.querySelector('.dua-text').textContent.toLowerCase();
      
      if (keywords.includes(searchTerm)) {
        found = true;
        const parentCollapse = dua.closest('.accordion-collapse');
        const parentItem = dua.closest('.accordion-item');
        
        parentItem.style.display = 'block';
        parentCollapse.classList.add('show');
      } else if (duaText.includes(searchTerm)) {
        found = true;
        const parentCollapse = dua.closest('.accordion-collapse');
        const parentItem = dua.closest('.accordion-item');
        
        parentItem.style.display = 'block';
        parentCollapse.classList.add('show');
      } else {
        dua.style.display = 'none';
      }
    });
    
    if (!found) {
      alert('لم يتم العثور على أدعية تطابق بحثك');
    } else {
      document.querySelectorAll('.accordion-item').forEach(item => {
        const hasVisibleDuas = Array.from(item.querySelectorAll('.dua-container')).some(
          dua => dua.style.display !== 'none'
        );
        
        if (!hasVisibleDuas) {
          item.style.display = 'none';
        }
      });
    }
  });