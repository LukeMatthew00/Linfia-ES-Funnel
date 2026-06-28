document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. INTERACTIVE QUIZ LOGIC (Zeigarnik & Goal Gradient Effect)
  // ==========================================================================
  const quizSteps = document.querySelectorAll('.quiz-step');
  const progressFill = document.querySelector('.quiz-progress-fill');
  const progressPercent = document.getElementById('progress-percent');
  const quizCard = document.getElementById('quiz-card');
  const quizLoading = document.getElementById('quiz-loading');
  const quizResult = document.getElementById('quiz-result');
  const currentStepSpan = document.getElementById('current-step');
  
  let currentStep = 1;
  const totalSteps = quizSteps.length;
  let isTransitioning = false;

  function updateProgressBar() {
    const percent = Math.round((currentStep / (totalSteps + 1)) * 100);
    progressFill.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;
    if (currentStepSpan) {
      currentStepSpan.textContent = currentStep;
    }
  }

  // Bind radio buttons click to auto-advance (low friction)
  const options = document.querySelectorAll('.quiz-option');
  options.forEach(option => {
    option.addEventListener('click', () => {
      if (isTransitioning) return;
      
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
      
      // Add visual active state
      const siblingOptions = option.parentElement.querySelectorAll('.quiz-option');
      siblingOptions.forEach(sib => sib.style.borderColor = 'var(--border-color)');
      option.style.borderColor = 'var(--primary)';
      
      // Auto-advance after 300ms
      setTimeout(() => {
        nextStep();
      }, 300);
    });
  });

  function nextStep() {
    if (isTransitioning) return;
    
    if (currentStep < totalSteps) {
      isTransitioning = true;
      const currentStepEl = quizSteps[currentStep - 1];
      const nextStepEl = quizSteps[currentStep];
      
      currentStepEl.classList.add('exit-left');
      nextStepEl.classList.add('enter-right');
      
      setTimeout(() => {
        currentStepEl.classList.remove('active', 'exit-left');
        nextStepEl.classList.remove('enter-right');
        nextStepEl.classList.add('active');
        
        currentStep++;
        updateProgressBar();
        isTransitioning = false;
      }, 350);
      
    } else if (currentStep === totalSteps) {
      isTransitioning = true;
      const currentStepEl = quizSteps[currentStep - 1];
      currentStepEl.classList.add('exit-left');
      
      setTimeout(() => {
        currentStepEl.classList.remove('active', 'exit-left');
        currentStep++;
        updateProgressBar();
        isTransitioning = false;
        
        if (quizLoading) {
          quizLoading.style.display = 'block';
          
          // Simulate a diagnostic analysis
          setTimeout(() => {
            quizLoading.style.display = 'none';
            showResults();
          }, 1800);
        }
      }, 350);
    }
  }

  function showResults() {
    progressFill.style.width = '100%';
    progressPercent.textContent = '100%';
    if (quizResult) {
      quizResult.style.display = 'block';
    }
  }

  // Reset quiz function (if needed)
  window.resetQuiz = function() {
    if (quizResult) quizResult.style.display = 'none';
    if (quizLoading) quizLoading.style.display = 'none';
    
    currentStep = 1;
    quizSteps.forEach(step => {
      step.classList.remove('active', 'exit-left', 'enter-right');
    });
    quizSteps[0].classList.add('active');
    
    options.forEach(opt => {
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = false;
      opt.style.borderColor = 'var(--border-color)';
    });
    
    updateProgressBar();
    isTransitioning = false;
  };

  // Initialize progress bar
  updateProgressBar();

  // ==========================================================================
  // 2. FAQ ACCORDION LOGIC
  // ==========================================================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    const answerDiv = item.querySelector('.faq-answer');
    
    questionButton.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });
      
      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
        answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
      } else {
        item.classList.remove('active');
        answerDiv.style.maxHeight = null;
      }
    });
  });

  // ==========================================================================
  // 3. TELEMETRY / SCARCITY SIMULATION (FOMO & Social Proof)
  // ==========================================================================
  const stockElement = document.getElementById('stock-counter');
  let currentStock = 6; // Starts at 6 from copy "Solo quedan 6 frascos en stock"
  
  function simulateStockDecrease() {
    if (currentStock > 2) {
      // Random interval between 20s and 45s
      const delay = Math.floor(Math.random() * 25000) + 20000;
      setTimeout(() => {
        currentStock--;
        if (stockElement) {
          stockElement.textContent = currentStock;
          stockElement.style.color = 'var(--danger)';
          setTimeout(() => {
            stockElement.style.color = 'inherit';
          }, 1000);
        }
        simulateStockDecrease();
      }, delay);
    }
  }
  
  simulateStockDecrease();

  // Active viewers counter
  const viewerElement = document.getElementById('viewer-counter');
  if (viewerElement) {
    setInterval(() => {
      // Randomly fluctuate between 11 and 19 viewers
      const viewers = Math.floor(Math.random() * 9) + 11;
      viewerElement.textContent = viewers;
    }, 8000);
  }

  // ==========================================================================
  // 4. CTA SMOOTH SCROLL & BUNDLE SELECTOR
  // ==========================================================================
  window.scrollToPricing = function() {
    const pricingSection = document.getElementById('ofertas');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Redirect to the main store page on purchase click
  window.buyBundle = function(bundleName, price) {
    window.location.href = "https://linfia-es.com/products/gotas-de-bienestar-para-el-drenaje-linfatico";
  };

  // ==========================================================================
  // 5. 3D MOTION EFFECTS (Mouse Tilt, Parallax & Reading Indicator)
  // ==========================================================================

  // (a) Custom Mouse-Tilt tracking on cards
  const tiltCards = document.querySelectorAll('.tilt-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Calculate rotation (max 8 degrees for smooth elegant tilt)
      const rotateX = ((centerY - y) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });

  // (b) 3D Scroll Parallax for Solution Image & Background Blobs
  const solutionImage = document.querySelector('.solution-image img');
  const sphere1 = document.querySelector('.sphere-1');
  const sphere2 = document.querySelector('.sphere-2');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    
    // Rotate and float product image in 3D based on scroll position
    if (solutionImage) {
      const rect = solutionImage.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const relativeScroll = scrolled - (elementTop - window.innerHeight);
      
      if (relativeScroll > 0) {
        // Rotate between -8deg and +8deg
        const rotateAngle = Math.min(Math.max(-8 + (relativeScroll * 0.015), -8), 8);
        // Float between -15px and +15px
        const translateY = Math.min(Math.max(-15 + (relativeScroll * 0.04), -15), 15);
        solutionImage.style.transform = `perspective(1000px) rotateY(${rotateAngle}deg) translateY(${translateY}px)`;
      }
    }
    
    // Parallax drift background spheres
    if (sphere1) {
      sphere1.style.transform = `translateY(${scrolled * 0.12}px)`;
    }
    if (sphere2) {
      sphere2.style.transform = `translateY(${scrolled * -0.08}px)`;
    }
  });

  // (c) Top Scroll Reading Indicator update
  const topProgressFill = document.querySelector('.scroll-progress-fill');
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (winScroll / height) * 100;
    if (topProgressFill) {
      topProgressFill.style.width = scrollPercent + "%";
    }
  });

  // ==========================================================================
  // 6. CUSTOM INTERACTIVE CURSOR TRAIL (Spring Physics, Desktop Only)
  // ==========================================================================
  const cursor = document.getElementById('custom-cursor');
  const cursorGlow = document.getElementById('custom-cursor-glow');
  
  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;
  let glowX = 0, glowY = 0;
  
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
  
  if (hasFinePointer && cursor && cursorGlow) {
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Spawn small water droplet particles with slight randomness
      if (Math.random() < 0.15) {
        createDropletTrail(mouseX, mouseY);
      }
    });
    
    function animateCursor() {
      const cursorLerp = 0.25;
      const glowLerp = 0.08;
      
      cursorX += (mouseX - cursorX) * cursorLerp;
      cursorY += (mouseY - cursorY) * cursorLerp;
      
      glowX += (mouseX - glowX) * glowLerp;
      glowY += (mouseY - glowY) * glowLerp;
      
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
      cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`;
      
      requestAnimationFrame(animateCursor);
    }
    requestAnimationFrame(animateCursor);
    
    // Bind hover states for custom cursor expansion
    const hoverables = document.querySelectorAll('a, button, input, select, .quiz-option, .faq-question');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        cursorGlow.classList.add('active');
      });
      item.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        cursorGlow.classList.remove('active');
      });
    });
  }
  
  function createDropletTrail(x, y) {
    const droplet = document.createElement('div');
    droplet.className = 'cursor-droplet';
    droplet.style.left = `${x}px`;
    droplet.style.top = `${y}px`;
    document.body.appendChild(droplet);
    
    setTimeout(() => {
      droplet.remove();
    }, 800);
  }

  // ==========================================================================
  // 7. "LÍQUIDO ATRAPADO" INTERACTIVE CALCULATOR LOGIC
  // ==========================================================================
  const hoursSlider = document.getElementById('calc-hours-slider');
  const hoursValText = document.getElementById('calc-hours-val');
  const fluidWeightText = document.getElementById('calc-fluid-weight');
  const blockageRateText = document.getElementById('calc-blockage-rate');
  const calcProgressFill = document.getElementById('calc-progress-fill');
  const constrictionPoint = document.getElementById('constriction-point');
  const capillaryPath = document.getElementById('capillary-path');

  // Interactive mapping to represent realistic physiological progressive weight & blockage scale
  const weightMap = [1.2, 1.4, 1.7, 1.9, 2.2, 2.4, 2.6, 2.9, 3.1, 3.4, 3.6, 3.8, 4.0];
  const blockageMap = [25, 32, 40, 48, 56, 68, 72, 77, 81, 84, 86, 88, 90];

  function updateCalculator() {
    if (!hoursSlider) return;
    
    const hours = parseInt(hoursSlider.value);
    const index = hours - 2; // Offset since min value of slider is 2h
    
    // Update texts
    if (hoursValText) hoursValText.textContent = `${hours} horas`;
    if (fluidWeightText) fluidWeightText.textContent = `${weightMap[index].toFixed(1)} kg`;
    if (blockageRateText) blockageRateText.textContent = `${blockageMap[index]}%`;
    
    // Update block progress bar
    if (calcProgressFill) {
      calcProgressFill.style.width = `${blockageMap[index]}%`;
      if (blockageMap[index] > 65) {
        calcProgressFill.style.backgroundColor = '#e53e3e'; // Alert red
        blockageRateText.style.color = '#e53e3e';
      } else if (blockageMap[index] > 45) {
        calcProgressFill.style.backgroundColor = '#dd6b20'; // Orange
        blockageRateText.style.color = '#dd6b20';
      } else {
        calcProgressFill.style.backgroundColor = 'var(--primary)'; // Teal
        blockageRateText.style.color = 'var(--primary)';
      }
    }
    
    // Update SVG gauge elements representing vessel constriction and flow rate
    if (constrictionPoint) {
      // Circle shrinks as blockage grows
      const radius = Math.max(16 - index * 1.0, 4);
      constrictionPoint.setAttribute('r', radius);
      // Turn circle red at higher constrictions
      if (hours > 8) {
        constrictionPoint.setAttribute('fill', 'rgba(229, 62, 62, 0.4)');
        constrictionPoint.setAttribute('stroke', '#e53e3e');
      } else {
        constrictionPoint.setAttribute('fill', 'rgba(223, 154, 40, 0.3)');
        constrictionPoint.setAttribute('stroke', 'var(--secondary)');
      }
    }
    
    if (capillaryPath) {
      // Stroke width narrows downstream as channel narrows
      const width = Math.max(8 - index * 0.5, 2.5);
      capillaryPath.setAttribute('stroke-width', width);
      // Flow rate slows down as blockage increases (increase duration of dash offset animation)
      const duration = (0.8 + index * 0.35).toFixed(2);
      capillaryPath.style.animationDuration = `${duration}s`;
    }
  }

  if (hoursSlider) {
    hoursSlider.addEventListener('input', updateCalculator);
    // Initialize calculator on page load
    updateCalculator();
  }
});
