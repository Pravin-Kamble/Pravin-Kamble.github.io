/**
 * PRAVIN KAMBLE - PORTFOLIO INTERACTION LOGIC
 * Main Interactive Logic: Theme, Typewriter, Scrollspy, Filter, Modals, Toast
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. THEME SWITCHER (Dark & Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleDesktop = document.getElementById('themeToggleDesktop');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const themeText = document.getElementById('themeText');
  const rootElement = document.documentElement;

  // Determine initial theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme ? savedTheme : (systemPrefersLight ? 'light' : 'dark');

  function applyTheme(theme) {
    rootElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    const isLight = theme === 'light';
    if (themeText) {
      themeText.textContent = isLight ? 'Light Mode' : 'Dark Mode';
    }

    // Update icons
    const sunIcons = document.querySelectorAll('.icon-sun');
    const moonIcons = document.querySelectorAll('.icon-moon');

    sunIcons.forEach(icon => {
      icon.style.display = isLight ? 'none' : 'block';
    });
    moonIcons.forEach(icon => {
      icon.style.display = isLight ? 'block' : 'none';
    });
  }

  applyTheme(initialTheme);

  function toggleTheme() {
    const currentTheme = rootElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  if (themeToggleDesktop) themeToggleDesktop.addEventListener('click', toggleTheme);
  if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

  // --------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // --------------------------------------------------------------------------
  const menuToggleBtn = document.getElementById('menuToggleBtn');
  const sidebar = document.getElementById('sidebar');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    sidebar.classList.toggle('mobile-open');
    mobileBackdrop.classList.toggle('active');
  }

  function closeMobileMenu() {
    sidebar.classList.remove('mobile-open');
    mobileBackdrop.classList.remove('active');
  }

  if (menuToggleBtn) menuToggleBtn.addEventListener('click', toggleMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 868) {
        closeMobileMenu();
      }
    });
  });

  // --------------------------------------------------------------------------
  // 3. SMOOTH TYPEWRITER EFFECT
  // --------------------------------------------------------------------------
  const typewriterElement = document.getElementById('typewriterText');
  const wordsToType = [
    'Java Full Stack Developer',
    'DevOps & AWS Cloud Engineer',
    'Spring Boot & Microservices Specialist',
    'Postgraduate from VJTI Mumbai (M.Tech)',
    '1st Place Winner (CSI TechNext India)'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function typeEffect() {
    if (!typewriterElement) return;

    const currentWord = wordsToType[wordIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 85;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      // Pause at full word
      isDeleting = true;
      typeSpeed = 1900;
    } else if (isDeleting && charIndex === 0) {
      // Switch to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % wordsToType.length;
      typeSpeed = 400;
    }

    setTimeout(typeEffect, typeSpeed);
  }

  typeEffect();

  // --------------------------------------------------------------------------
  // 4. SCROLLSPY (ACTIVE NAV HIGHLIGHT)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 180;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // --------------------------------------------------------------------------
  // 5. PROJECT FILTERING
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || category.includes(filterValue)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 6. PROJECT DETAIL MODAL (QUICK VIEW)
  // --------------------------------------------------------------------------
  const modalBackdrop = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalTitle = document.getElementById('modalTitle');
  const modalCategory = document.getElementById('modalCategory');
  const modalDesc = document.getElementById('modalDesc');
  const modalImg = document.getElementById('modalImg');
  const modalFeatures = document.getElementById('modalFeatures');

  // Pravin's Project Details Database
  const projectData = {
    'fin-microservices': {
      title: 'Enterprise Financial Microservices Architecture',
      category: 'Enterprise / AWS Cloud',
      image: 'assets/images/project-2.svg',
      description: 'Designed and deployed mission-critical financial applications for National e-Repository Limited (NeRL). Built using Java, Spring Boot, and RESTful microservices integrated with AWS API Gateway for secure transactional processing.',
      features: [
        'Decoupled microservice architecture with AWS API Gateway for centralized routing, rate limiting, and auth',
        'Secure high-availability persistence layer integrated with Oracle Database and AWS RDS',
        'Optimized JVM performance and production code paths to ensure sub-second response times',
        'Strict financial compliance, audit trail recording, and enterprise data encryption using AWS KMS'
      ]
    },
    'cicd-pipeline': {
      title: 'Automated CI/CD & Infrastructure Deployment Engine',
      category: 'DevOps / CI/CD Automation',
      image: 'assets/images/project-6.svg',
      description: 'Enterprise automation pipeline utilizing Jenkins to orchestrate build, testing, and deployment cycles across Red Hat Enterprise Linux (RHEL) and Amazon Linux 2023 instances.',
      features: [
        'Automated multi-stage pipelines in Jenkins with Maven build verification and unit testing',
        'Zero-downtime rolling deployments across Amazon EC2 clusters with rollback safeguards',
        'System monitoring and automated alerts configured through Amazon CloudWatch and SNS',
        'Significantly reduced manual release effort and increased deployment frequency with full auditability'
      ]
    },
    'cnn-detection': {
      title: 'CNN Object Detection & Nutritional Analysis',
      category: 'AI & Deep Learning Research',
      image: 'assets/images/project-1.svg',
      description: 'Published scientific research paper in the International Journal of Innovative Technology and Exploring Engineering (IJITEE). Developed a Convolutional Neural Network (CNN) model for automated fruit recognition and nutritional value estimation.',
      features: [
        'Designed custom CNN feature extraction pipelines in Python using OpenCV for image preprocessing',
        'Automated classification and segmentation across diverse lighting and spatial angles',
        'Calculated nutritional value estimates mapped to fruit volume and category detection',
        'Published in IJITEE: "Object Detection using CNN in the Application of Supplementary Nutrition Value of Fruits"'
      ]
    },
    'serverless-events': {
      title: 'Serverless Event-Driven Notification System',
      category: 'AWS Cloud & Serverless',
      image: 'assets/images/project-3.svg',
      description: 'Cloud-native asynchronous event processing pipeline supporting financial transactions, notifications, and scheduled operational jobs with zero server maintenance.',
      features: [
        'AWS SES integration for high-volume transactional email alerts and financial dispatch',
        'AWS Lambda functions triggered via AWS EventBridge and Amazon SNS for asynchronous events',
        'Encrypted environment variables and credential protection using AWS KMS & IAM role delegation',
        'Real-time metrics and log tracing configured via Amazon CloudWatch alarms'
      ]
    },
    'smart-noticeboard': {
      title: 'Smart Digital Noticeboard via Raspberry Pi',
      category: 'IoT & Embedded Systems',
      image: 'assets/images/project-4.svg',
      description: 'An IoT-based electronic noticeboard system powered by Raspberry Pi and Python, enabling campus/corporate networks to broadcast critical alerts and schedules remotely in real time.',
      features: [
        'Lightweight Python socket and HTTP server running on Raspberry Pi connected to HDMI display',
        'Instant multi-user broadcast interface with authentication for verified announcements',
        'Offline caching mechanism: preserves existing notice board display during network disruptions',
        'Energy-efficient hardware scheduling for automated sleep and active display hours'
      ]
    },
    'disaster-app': {
      title: 'Disaster Management & Emergency Response Application',
      category: 'Android / Mobile Engineering',
      image: 'assets/images/project-5.svg',
      description: 'An Android mobile application built using Java and Android Studio to coordinate emergency relief, provide live safety instructions, and alert rescue services during crisis situations.',
      features: [
        'One-touch SOS button broadcasting GPS coordinates to registered emergency contacts',
        'Offline first aid and disaster survival guidelines accessible without cellular connectivity',
        'Interactive map view displaying nearby hospitals, shelters, and designated safe zones',
        'Local SQLite storage for personal health records, blood group, and emergency data'
      ]
    }
  };

  const quickViewBtns = document.querySelectorAll('.btn-quick-view');

  quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      const data = projectData[projectId];

      if (data && modalBackdrop) {
        modalTitle.textContent = data.title;
        modalCategory.textContent = data.category;
        modalDesc.textContent = data.description;
        modalImg.src = data.image;
        modalImg.alt = data.title;

        // Render features
        modalFeatures.innerHTML = '';
        data.features.forEach(feat => {
          const li = document.createElement('li');
          li.textContent = feat;
          modalFeatures.appendChild(li);
        });

        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // --------------------------------------------------------------------------
  // 7. TOAST NOTIFICATION & COPY EMAIL TO CLIPBOARD
  // --------------------------------------------------------------------------
  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'pravinkamble704@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email copied to clipboard!');
      }).catch(() => {
        showToast('Copied: ' + email);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM SUBMISSION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('formName');
      const emailInput = document.getElementById('formEmail');
      const subjectInput = document.getElementById('formSubject');
      const messageInput = document.getElementById('formMessage');

      const name = nameInput ? nameInput.value : '';
      const email = emailInput ? emailInput.value : '';
      const subject = subjectInput ? subjectInput.value : 'Inquiry from Portfolio';
      const message = messageInput ? messageInput.value : '';

      // Construct mailto link
      const mailtoLink = `mailto:${encodeURIComponent('pravinkamble704@gmail.com')}?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + message)}`;
      
      showToast('Opening your email client...');
      setTimeout(() => {
        window.location.href = mailtoLink;
        contactForm.reset();
      }, 600);
    });
  }
});
