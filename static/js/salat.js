window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  window.addEventListener('load', function() {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.7s ease';
    
    const today = new Date();
    const dateInput = document.getElementById('date-select');
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setMonth(today.getMonth() + 3); 
    
    dateInput.min = formatDateForInput(minDate);
    dateInput.max = formatDateForInput(maxDate);
    dateInput.value = formatDateForInput(today);
    
    updateHijriDate(today);
    
    const citySelect = document.getElementById('city-select');
    citySelect.addEventListener('change', function() {
      updatePrayerTimes(this.value, dateInput.value);
    });
    
    dateInput.addEventListener('change', function() {
      updatePrayerTimes(citySelect.value, this.value);
      const selectedDate = new Date(this.value);
      updateHijriDate(selectedDate);
    });
    
    updatePrayerTimes('makkah', formatDateForInput(today));
    
    setInterval(function() {
      updateRemainingTimes();
      updateCurrentPrayer();
    }, 60000);
    
    updateRemainingTimes();
    updateCurrentPrayer();
  });
  
  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  function updateHijriDate(date) {
    const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
    
    document.getElementById('hijri-date').textContent = hijriDate;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const gregorianDate = date.toLocaleDateString('ar-SA', options);
    document.getElementById('current-date').textContent = gregorianDate;
  }
  
  function updatePrayerTimes(city, dateStr) {
    const prayerData = getPrayerTimesForCityAndDate(city, dateStr);
    
    document.getElementById('fajr-time').textContent = prayerData.fajr;
    document.getElementById('sunrise-time').textContent = prayerData.sunrise;
    document.getElementById('dhuhr-time').textContent = prayerData.dhuhr;
    document.getElementById('asr-time').textContent = prayerData.asr;
    document.getElementById('maghrib-time').textContent = prayerData.maghrib;
    document.getElementById('isha-time').textContent = prayerData.isha;
    
    document.getElementById('fajr-adhan').textContent = prayerData.fajr;
    document.getElementById('fajr-iqama').textContent = addMinutes(prayerData.fajr, 15);
    document.getElementById('fajr-end').textContent = prayerData.sunrise;
    
    document.getElementById('dhuhr-adhan').textContent = prayerData.dhuhr;
    document.getElementById('dhuhr-iqama').textContent = addMinutes(prayerData.dhuhr, 15);
    document.getElementById('dhuhr-end').textContent = prayerData.asr;
    
    document.getElementById('asr-adhan').textContent = prayerData.asr;
    document.getElementById('asr-iqama').textContent = addMinutes(prayerData.asr, 15);
    document.getElementById('asr-end').textContent = prayerData.maghrib;
    
    document.getElementById('maghrib-adhan').textContent = prayerData.maghrib;
    document.getElementById('maghrib-iqama').textContent = addMinutes(prayerData.maghrib, 5);
    document.getElementById('maghrib-end').textContent = prayerData.isha;
    
    document.getElementById('isha-adhan').textContent = prayerData.isha;
    document.getElementById('isha-iqama').textContent = addMinutes(prayerData.isha, 15);
    document.getElementById('isha-end').textContent = prayerData.nextFajr || prayerData.fajr;
    
    document.getElementById('sunrise-end').textContent = prayerData.dhuhr;
    
    updateRemainingTimes();
    
    updateCurrentPrayer();
  }
  
  function addMinutes(timeStr, minutesToAdd) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'م' && hours !== 12) hours += 12;
    if (period === 'ص' && hours === 12) hours = 0;
    
    let totalMinutes = hours * 60 + minutes + minutesToAdd;
    
    totalMinutes = totalMinutes % (24 * 60);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    
    hours = Math.floor(totalMinutes / 60);
    minutes = totalMinutes % 60;
    
    let newPeriod = 'ص';
    if (hours >= 12) {
      newPeriod = 'م';
      if (hours > 12) hours -= 12;
    }
    if (hours === 0) hours = 12;
    
    return `${hours}:${String(minutes).padStart(2, '0')} ${newPeriod}`;
  }
  
  function updateRemainingTimes() {
    const now = new Date();
    const currentHours = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = currentHours * 60 + currentMinutes;
    
    const prayerTimes = getPrayerTimesAsDates();
    
    const remainingTimes = {};
    for (const prayer in prayerTimes) {
      if (prayerTimes[prayer] > now) {
        const diffMs = prayerTimes[prayer] - now;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        remainingTimes[prayer] = `باقي ${diffHours} ساعات و ${diffMinutes} دقيقة`;
      } else {
        remainingTimes[prayer] = 'انتهى وقت الصلاة';
      }
    }
    
    document.getElementById('fajr-remaining').textContent = remainingTimes.fajr || '--';
    document.getElementById('sunrise-remaining').textContent = remainingTimes.sunrise || '--';
    document.getElementById('dhuhr-remaining').textContent = remainingTimes.dhuhr || '--';
    document.getElementById('asr-remaining').textContent = remainingTimes.asr || '--';
    document.getElementById('maghrib-remaining').textContent = remainingTimes.maghrib || '--';
    document.getElementById('isha-remaining').textContent = remainingTimes.isha || '--';
  }
  
  function getPrayerTimesAsDates() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    
    const times = {};
    const prayerElements = {
      fajr: document.getElementById('fajr-time'),
      sunrise: document.getElementById('sunrise-time'),
      dhuhr: document.getElementById('dhuhr-time'),
      asr: document.getElementById('asr-time'),
      maghrib: document.getElementById('maghrib-time'),
      isha: document.getElementById('isha-time')
    };
    
    for (const prayer in prayerElements) {
      const timeStr = prayerElements[prayer].textContent;
      const [time, period] = timeStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      
      if (period === 'م' && hours !== 12) hours += 12;
      if (period === 'ص' && hours === 12) hours = 0;
      
      const isNextDay = prayer === 'isha' && hours < 6; 
      
      times[prayer] = new Date(year, month, isNextDay ? day + 1 : day, hours, minutes);
    }
    
    return times;
  }
  
  function updateCurrentPrayer() {
    const now = new Date();
    const prayerTimes = getPrayerTimesAsDates();
    
    document.querySelectorAll('.prayer-card').forEach(card => {
      card.classList.remove('current');
    });
    
    let currentPrayer = null;
    const prayersOrder = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
    
    for (let i = 0; i < prayersOrder.length; i++) {
      const prayer = prayersOrder[i];
      const nextPrayer = prayersOrder[i + 1] || prayersOrder[0]; 
      
      if (now >= prayerTimes[prayer] && now < prayerTimes[nextPrayer]) {
        currentPrayer = prayer;
        break;
      }
    }
    
    if (currentPrayer) {
      const currentCard = document.getElementById(`${currentPrayer}-card`) || 
                         document.querySelector(`.prayer-card:nth-child(${prayersOrder.indexOf(currentPrayer) + 1}`);
      if (currentCard) {
        currentCard.classList.add('current');
        document.getElementById('current-prayer-label').textContent = 'الصلاة الحالية';
      }
    }
  }
  
  function getPrayerTimesForCityAndDate(city, dateStr) {
    const date = new Date(dateStr);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const baseTimes = {
      makkah: {
        fajr: `${4 + Math.floor(day/10)}:${30 - (day % 3)} ص`,
        sunrise: `${6 + Math.floor(day/15)}:${15 + (day % 5)} ص`,
        dhuhr: `${12}:${30 - (day % 2)} م`,
        asr: `${3 + Math.floor(day/10)}:${45 - (day % 4)} م`,
        maghrib: `${6 + Math.floor(day/15)}:${30 - (day % 3)} م`,
        isha: `${8 - Math.floor(day/20)}:${0 + (day % 5)} م`,
        nextFajr: `${4 + Math.floor((day+1)/10)}:${30 - ((day+1) % 3)} ص`
      },
      madina: {
        fajr: `${4 + Math.floor(day/12)}:${45 - (day % 4)} ص`,
        sunrise: `${6 + Math.floor(day/18)}:${30 + (day % 6)} ص`,
        dhuhr: `${12}:${45 - (day % 3)} م`,
        asr: `${4 + Math.floor(day/12)}:${0 - (day % 5)} م`,
        maghrib: `${6 + Math.floor(day/18)}:${45 - (day % 4)} م`,
        isha: `${8 - Math.floor(day/22)}:${15 + (day % 6)} م`,
        nextFajr: `${4 + Math.floor((day+1)/12)}:${45 - ((day+1) % 4)} ص`
      },
      riyadh: {
        fajr: `${4 + Math.floor(day/8)}:${15 - (day % 2)} ص`,
        sunrise: `${5 + Math.floor(day/12)}:${45 + (day % 4)} ص`,
        dhuhr: `${12}:${15 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/8)}:${30 - (day % 3)} م`,
        maghrib: `${6 + Math.floor(day/12)}:${15 - (day % 2)} م`,
        isha: `${7 - Math.floor(day/18)}:${45 + (day % 4)} م`,
        nextFajr: `${4 + Math.floor((day+1)/8)}:${15 - ((day+1) % 2)} ص`
      },
      jeddah: {
        fajr: `${4 + Math.floor(day/10)}:${40 - (day % 3)} ص`,
        sunrise: `${6 + Math.floor(day/15)}:${20 + (day % 5)} ص`,
        dhuhr: `${12}:${40 - (day % 2)} م`,
        asr: `${4 + Math.floor(day/10)}:${0 - (day % 4)} م`,
        maghrib: `${6 + Math.floor(day/15)}:${40 - (day % 3)} م`,
        isha: `${8 - Math.floor(day/20)}:${10 + (day % 5)} م`,
        nextFajr: `${4 + Math.floor((day+1)/10)}:${40 - ((day+1) % 3)} ص`
      },
      dammam: {
        fajr: `${4 + Math.floor(day/7)}:${0 - (day % 1)} ص`,
        sunrise: `${5 + Math.floor(day/10)}:${30 + (day % 3)} ص`,
        dhuhr: `${12}:${0 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/7)}:${15 - (day % 2)} م`,
        maghrib: `${6 + Math.floor(day/10)}:${0 - (day % 1)} م`,
        isha: `${7 - Math.floor(day/15)}:${30 + (day % 3)} م`,
        nextFajr: `${4 + Math.floor((day+1)/7)}:${0 - ((day+1) % 1)} ص`
      },
      taif: {
        fajr: `${4 + Math.floor(day/11)}:${50 - (day % 4)} ص`,
        sunrise: `${6 + Math.floor(day/16)}:${30 + (day % 6)} ص`,
        dhuhr: `${12}:${50 - (day % 3)} م`,
        asr: `${4 + Math.floor(day/11)}:${10 - (day % 5)} م`,
        maghrib: `${6 + Math.floor(day/16)}:${50 - (day % 4)} م`,
        isha: `${8 - Math.floor(day/21)}:${20 + (day % 6)} م`,
        nextFajr: `${4 + Math.floor((day+1)/11)}:${50 - ((day+1) % 4)} ص`
      },
      yanbu: {
        fajr: `${4 + Math.floor(day/10)}:${35 - (day % 3)} ص`,
        sunrise: `${6 + Math.floor(day/15)}:${25 + (day % 5)} ص`,
        dhuhr: `${12}:${35 - (day % 2)} م`,
        asr: `${3 + Math.floor(day/10)}:${50 - (day % 4)} م`,
        maghrib: `${6 + Math.floor(day/15)}:${35 - (day % 3)} م`,
        isha: `${8 - Math.floor(day/20)}:${5 + (day % 5)} م`,
        nextFajr: `${4 + Math.floor((day+1)/10)}:${35 - ((day+1) % 3)} ص`
      },
      hafralbatin: {
        fajr: `${4 + Math.floor(day/8)}:${10 - (day % 1)} ص`,
        sunrise: `${5 + Math.floor(day/12)}:${50 + (day % 4)} ص`,
        dhuhr: `${12}:${10 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/8)}:${20 - (day % 2)} م`,
        maghrib: `${6 + Math.floor(day/12)}:${10 - (day % 1)} م`,
        isha: `${7 - Math.floor(day/18)}:${50 + (day % 4)} م`,
        nextFajr: `${4 + Math.floor((day+1)/8)}:${10 - ((day+1) % 1)} ص`
      },
      abha: {
        fajr: `${4 + Math.floor(day/9)}:${20 - (day % 2)} ص`,
        sunrise: `${6 + Math.floor(day/14)}:${10 + (day % 4)} ص`,
        dhuhr: `${12}:${20 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/9)}:${40 - (day % 3)} م`,
        maghrib: `${6 + Math.floor(day/14)}:${20 - (day % 2)} م`,
        isha: `${7 - Math.floor(day/19)}:${10 + (day % 4)} م`,
        nextFajr: `${4 + Math.floor((day+1)/9)}:${20 - ((day+1) % 2)} ص`
      },
      tabuk: {
        fajr: `${4 + Math.floor(day/9)}:${25 - (day % 2)} ص`,
        sunrise: `${6 + Math.floor(day/14)}:${15 + (day % 4)} ص`,
        dhuhr: `${12}:${25 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/9)}:${45 - (day % 3)} م`,
        maghrib: `${6 + Math.floor(day/14)}:${25 - (day % 2)} م`,
        isha: `${7 - Math.floor(day/19)}:${15 + (day % 4)} م`,
        nextFajr: `${4 + Math.floor((day+1)/9)}:${25 - ((day+1) % 2)} ص`
      },
      qassim: {
        fajr: `${4 + Math.floor(day/8)}:${20 - (day % 2)} ص`,
        sunrise: `${5 + Math.floor(day/12)}:${50 + (day % 4)} ص`,
        dhuhr: `${12}:${20 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/8)}:${30 - (day % 3)} م`,
        maghrib: `${6 + Math.floor(day/12)}:${20 - (day % 2)} م`,
        isha: `${7 - Math.floor(day/18)}:${50 + (day % 4)} م`,
        nextFajr: `${4 + Math.floor((day+1)/8)}:${20 - ((day+1) % 2)} ص`
      },
      hail: {
        fajr: `${4 + Math.floor(day/8)}:${15 - (day % 1)} ص`,
        sunrise: `${5 + Math.floor(day/12)}:${45 + (day % 4)} ص`,
        dhuhr: `${12}:${15 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/8)}:${25 - (day % 2)} م`,
        maghrib: `${6 + Math.floor(day/12)}:${15 - (day % 1)} م`,
        isha: `${7 - Math.floor(day/18)}:${45 + (day % 4)} م`,
        nextFajr: `${4 + Math.floor((day+1)/8)}:${15 - ((day+1) % 1)} ص`
      },
      jazan: {
        fajr: `${4 + Math.floor(day/10)}:${25 - (day % 2)} ص`,
        sunrise: `${6 + Math.floor(day/15)}:${15 + (day % 5)} ص`,
        dhuhr: `${12}:${25 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/10)}:${45 - (day % 3)} م`,
        maghrib: `${6 + Math.floor(day/15)}:${25 - (day % 2)} م`,
        isha: `${7 - Math.floor(day/20)}:${15 + (day % 5)} م`,
        nextFajr: `${4 + Math.floor((day+1)/10)}:${25 - ((day+1) % 2)} ص`
      },
      najran: {
        fajr: `${4 + Math.floor(day/10)}:${20 - (day % 1)} ص`,
        sunrise: `${6 + Math.floor(day/15)}:${10 + (day % 5)} ص`,
        dhuhr: `${12}:${20 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/10)}:${40 - (day % 3)} م`,
        maghrib: `${6 + Math.floor(day/15)}:${20 - (day % 1)} م`,
        isha: `${7 - Math.floor(day/20)}:${10 + (day % 5)} م`,
        nextFajr: `${4 + Math.floor((day+1)/10)}:${20 - ((day+1) % 1)} ص`
      },
      bahah: {
        fajr: `${4 + Math.floor(day/9)}:${30 - (day % 2)} ص`,
        sunrise: `${6 + Math.floor(day/14)}:${20 + (day % 4)} ص`,
        dhuhr: `${12}:${30 - (day % 1)} م`,
        asr: `${3 + Math.floor(day/9)}:${50 - (day % 3)} م`,
        maghrib: `${6 + Math.floor(day/14)}:${30 - (day % 2)} م`,
        isha: `${7 - Math.floor(day/19)}:${20 + (day % 4)} م`,
        nextFajr: `${4 + Math.floor((day+1)/9)}:${30 - ((day+1) % 2)} ص`
      }
    };
    
    return baseTimes[city] || baseTimes.makkah;
  }