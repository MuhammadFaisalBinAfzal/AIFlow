/* ============================================================
   UTILITY: Throttle — limits function call rate
   ============================================================ */
function throttle(fn, wait) {
  var lastTime = 0;
  return function() {
    var now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn.apply(this, arguments);
    }
  };
}

/* ============================================================
   NAVIGATION: Scroll State & Active Highlight
   ============================================================ */
var mainNav = document.getElementById('mainNav');
var navLinks = document.querySelectorAll('#navLinks a[data-section]');
var sections = document.querySelectorAll('section[id]');
var scrollProgressBar = document.getElementById('scrollProgress');

function handleNavScroll() {
  var scrollY = window.scrollY;
  if (scrollY > 50) {
    mainNav.classList.add('scrolled');
  } else {
    mainNav.classList.remove('scrolled');
  }
  var docHeight = document.documentElement.scrollHeight - window.innerHeight;
  var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  scrollProgressBar.style.width = progress + '%';
}

function updateActiveNav() {
  var scrollY = window.scrollY + 150;
  for (var i = 0; i < sections.length; i++) {
    var section = sections[i];
    var top = section.offsetTop;
    var height = section.offsetHeight;
    var id = section.getAttribute('id');
    if (scrollY >= top && scrollY < top + height) {
      for (var j = 0; j < navLinks.length; j++) {
        navLinks[j].classList.remove('active');
        if (navLinks[j].getAttribute('data-section') === id) {
          navLinks[j].classList.add('active');
        }
      }
    }
  }
}

window.addEventListener('scroll', function() {
  handleNavScroll();
  updateActiveNav();
}, { passive: true });

/* ============================================================
   MOBILE MENU
   ============================================================ */
var navHamburger = document.getElementById('navHamburger');
var mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  navHamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  navHamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

navHamburger.addEventListener('click', function() {
  var isOpen = mobileMenu.classList.toggle('open');
  navHamburger.classList.toggle('open');
  navHamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

/* ============================================================
   CURSOR GLOW (Desktop only, pointer: fine)
   ============================================================ */
var cursorGlow = document.getElementById('cursorGlow');
var cursorX = 0, cursorY = 0, glowX = 0, glowY = 0;

if (window.matchMedia('(pointer: fine)').matches) {
  document.addEventListener('mousemove', function(e) {
    cursorX = e.clientX;
    cursorY = e.clientY;
    if (!cursorGlow.classList.contains('active')) {
      cursorGlow.classList.add('active');
    }
  });

  function animateCursorGlow() {
    glowX += (cursorX - glowX) * 0.08;
    glowY += (cursorY - glowY) * 0.08;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateCursorGlow);
  }
  animateCursorGlow();
}

/* ============================================================
   PARTICLES SYSTEM (Canvas) — Neural Network Effect
   ============================================================ */
var particlesCanvas = document.getElementById('particlesCanvas');
var pCtx = particlesCanvas.getContext('2d');
var particles = [];
var PARTICLE_COUNT = 45;

function resizeParticlesCanvas() {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
}
resizeParticlesCanvas();
window.addEventListener('resize', resizeParticlesCanvas);

function createParticles() {
  particles = [];
  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * particlesCanvas.width,
      y: Math.random() * particlesCanvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1
    });
  }
}
createParticles();

function drawParticles() {
  pCtx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  var maxDist = 120;

  for (var i = 0; i < particles.length; i++) {
    var p = particles[i];
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = particlesCanvas.width;
    if (p.x > particlesCanvas.width) p.x = 0;
    if (p.y < 0) p.y = particlesCanvas.height;
    if (p.y > particlesCanvas.height) p.y = 0;

    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    pCtx.fillStyle = 'rgba(99, 102, 241, ' + p.opacity + ')';
    pCtx.fill();

    for (var j = i + 1; j < particles.length; j++) {
      var p2 = particles[j];
      var dx = p.x - p2.x;
      var dy = p.y - p2.y;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        var alpha = (1 - dist / maxDist) * 0.08;
        pCtx.beginPath();
        pCtx.moveTo(p.x, p.y);
        pCtx.lineTo(p2.x, p2.y);
        pCtx.strokeStyle = 'rgba(99, 102, 241, ' + alpha + ')';
        pCtx.lineWidth = 0.5;
        pCtx.stroke();
      }
    }
  }

  requestAnimationFrame(drawParticles);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  drawParticles();
}

/* ============================================================
   HERO WORKFLOW ANIMATION — Sequential Step Glow
   ============================================================ */
var workflowSteps = document.querySelectorAll('#heroWorkflow .workflow-step');
var workflowArrows = document.querySelectorAll('#heroWorkflow .workflow-arrow');
var currentWorkflowStep = 0;

function animateWorkflow() {
  for (var i = 0; i < workflowSteps.length; i++) {
    workflowSteps[i].classList.remove('active');
  }
  for (var i = 0; i < workflowArrows.length; i++) {
    workflowArrows[i].classList.remove('active');
  }

  workflowSteps[currentWorkflowStep].classList.add('active');
  if (currentWorkflowStep > 0) {
    workflowArrows[currentWorkflowStep - 1].classList.add('active');
  }

  currentWorkflowStep = (currentWorkflowStep + 1) % workflowSteps.length;
}

setInterval(animateWorkflow, 800);
animateWorkflow();

/* ============================================================
   INTERSECTION OBSERVER: Scroll Reveal Animations
   ============================================================ */
var revealElements = document.querySelectorAll(
  '.problem-card, .transform-card, .how-step, .employee-card, .pricing-card'
);

var revealObserver = new IntersectionObserver(function(entries) {
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    if (entry.isIntersecting) {
      var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
      (function(el, d) {
        setTimeout(function() {
          el.classList.add('revealed');
        }, d);
      })(entry.target, delay);
      revealObserver.unobserve(entry.target);
    }
  }
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -40px 0px'
});

for (var i = 0; i < revealElements.length; i++) {
  revealObserver.observe(revealElements[i]);
}

/* ============================================================
   HOW IT WORKS: Scroll-triggered Active Steps
   ============================================================ */
var howSteps = document.querySelectorAll('#howWorkflow .how-step');
var howStepObserver = new IntersectionObserver(function(entries) {
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i];
    if (entry.isIntersecting) {
      for (var j = 0; j < howSteps.length; j++) {
        howSteps[j].classList.remove('active-step');
      }
      entry.target.classList.add('active-step');
    }
  }
}, {
  threshold: 0.5,
  rootMargin: '0px 0px -30% 0px'
});

for (var i = 0; i < howSteps.length; i++) {
  howStepObserver.observe(howSteps[i]);
}

/* ============================================================
   TECHNOLOGY ORBIT: Position Nodes Around Center
   ============================================================ */
var techNames = ['n8n','OpenAI','Claude','Gemini','MCP','RAG','Pinecone','Supabase','PostgreSQL','WhatsApp API','Gmail','Shopify','WooCommerce','Stripe'];
var orbitContainer = document.getElementById('orbitContainer');
var orbitNodes = [];

function positionOrbitNodes() {
  for (var i = 0; i < orbitNodes.length; i++) {
    orbitNodes[i].remove();
  }
  orbitNodes = [];

  var containerRect = orbitContainer.getBoundingClientRect();
  var cx = containerRect.width / 2;
  var cy = containerRect.height / 2;
  var ringRadii = [120, 180, 220];
  var nodesPerRing = [5, 5, 4];

  var nodeIndex = 0;
  for (var r = 0; r < ringRadii.length; r++) {
    var radius = ringRadii[r];
    var count = nodesPerRing[r];
    for (var i = 0; i < count; i++) {
      var angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      var x = cx + Math.cos(angle) * radius;
      var y = cy + Math.sin(angle) * radius;

      var line = document.createElement('div');
      line.className = 'orbit-line';
      var dx = x - cx;
      var dy = y - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);
      var angleDeg = Math.atan2(dy, dx) * (180 / Math.PI);
      line.style.width = dist + 'px';
      line.style.transform = 'rotate(' + angleDeg + 'deg)';
      line.style.top = cy + 'px';
      line.style.left = cx + 'px';
      line.style.background = 'linear-gradient(90deg, rgba(99,102,241,0.15), transparent)';
      orbitContainer.appendChild(line);
      orbitNodes.push(line);

      var node = document.createElement('div');
      node.className = 'orbit-node';
      node.textContent = techNames[nodeIndex] || '';
      node.style.left = (x - 20) + 'px';
      node.style.top = (y - 20) + 'px';
      orbitContainer.appendChild(node);
      orbitNodes.push(node);

      nodeIndex++;
    }
  }
}

positionOrbitNodes();
window.addEventListener('resize', throttle(positionOrbitNodes, 200));

/* ============================================================
   BUTTON RIPPLE EFFECT
   ============================================================ */
var rippleButtons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .pricing-btn');
for (var i = 0; i < rippleButtons.length; i++) {
  (function(btn) {
    btn.addEventListener('click', function(e) {
      var ripple = document.createElement('span');
      ripple.className = 'ripple';
      var rect = btn.getBoundingClientRect();
      var size = Math.max(rect.width, rect.height);
      ripple.style.width = size + 'px';
      ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', function() {
        ripple.remove();
      });
    });
  })(rippleButtons[i]);
}

/* ============================================================
   BACK TO TOP BUTTON
   ============================================================ */
var backToTop = document.getElementById('backToTop');

window.addEventListener('scroll', function() {
  if (window.scrollY > 600) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}, { passive: true });

backToTop.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   CONTACT FORM HANDLER
   ============================================================ */
function handleFormSubmit(e) {
  e.preventDefault();
  var form = e.target;
  var formData = new FormData(form);
  var data = {};
  formData.forEach(function(value, key) {
    data[key] = value;
  });
  console.log('Form submitted:', data);
  var btn = form.querySelector('button[type="submit"]');
  var originalText = btn.innerHTML;
  btn.innerHTML = 'Sent Successfully!';
  btn.style.background = 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)';
  setTimeout(function() {
    btn.innerHTML = originalText;
    btn.style.background = '';
    form.reset();
  }, 3000);
}

/* ============================================================
   SOFT TILT EFFECT ON CARDS (Desktop only)
   ============================================================ */
if (window.matchMedia('(pointer: fine)').matches) {
  var tiltCards = document.querySelectorAll('.employee-card, .pricing-card');
  for (var i = 0; i < tiltCards.length; i++) {
    (function(card) {
      card.addEventListener('mousemove', function(e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var rotateX = ((y - centerY) / centerY) * -3;
        var rotateY = ((x - centerX) / centerX) * 3;
        card.style.transform = 'translateY(-6px) perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
      });
      card.addEventListener('mouseleave', function() {
        card.style.transform = '';
      });
    })(tiltCards[i]);
  }
}

/* ============================================================
   ANIMATED COUNTER UTILITY (available for stats sections)
   ============================================================ */
function animateCounter(el, target, duration) {
  var startTime = performance.now();
  function update(currentTime) {
    var elapsed = currentTime - startTime;
    var progress = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

/* ============================================================
   INIT
   ============================================================ */
handleNavScroll();
updateActiveNav();