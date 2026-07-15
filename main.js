/* ============================================
   DEVCLUB - SCRIPT.JS
   ============================================
   Funcionalidades:
   1. Header scroll effect
   2. Menu mobile toggle
   3. Reveal on scroll (Intersection Observer)
   4. Active nav link
   5. Smooth scroll
   6. Newsletter form
   ============================================ */


/* ============================================
   1. HEADER SCROLL EFFECT
   ============================================
   Adiciona classe 'scrolled' ao header quando
   o usuário rola mais de 50px.
   Isso muda o padding e o background.
*/

const header = document.getElementById('header');

function handleHeaderScroll() {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

// Usa passive: true para melhor performance
window.addEventListener('scroll', handleHeaderScroll, { passive: true });


/* ============================================
   2. MENU MOBILE TOGGLE
   ============================================
   Abre/fecha o menu mobile ao clicar no botão.
   Como o HTML não tem o menu mobile completo,
   este código prepara a estrutura para quando
   você adicionar o menu mobile.
*/

const menuToggle = document.getElementById('menuToggle');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    
    // Aqui você pode adicionar lógica para mostrar/ocultar
    // um menu mobile se existir no HTML
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }
  });
}


/* ============================================
   3. REVEAL ON SCROLL
   ============================================
   Usa Intersection Observer para detectar quando
   elementos com classe 'reveal' entram na viewport
   e adiciona a classe 'active' para animar.
   
   Por que Intersection Observer?
   - Mais performático que scroll events
   - Não bloqueia a thread principal
   - API nativa do navegador
*/

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Opcional: parar de observar após animar uma vez
      // revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,        // Dispara quando 10% do elemento está visível
  rootMargin: '0px 0px -50px 0px' // Dispara um pouco antes do elemento entrar
});

revealElements.forEach(el => revealObserver.observe(el));


/* ============================================
   4. ACTIVE NAV LINK
   ============================================
   Destaca o link do menu conforme a seção
   visível na tela.
*/

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        // Compara o href do link com o id da seção
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
      });
    }
  });
}, {
  rootMargin: '-50% 0px -50% 0px', // Considera apenas o centro da tela
  threshold: 0
});

sections.forEach(section => navObserver.observe(section));


/* ============================================
   5. SMOOTH SCROLL
   ============================================
   Scroll suave ao clicar em links âncora.
   Usa scrollIntoView com behavior: 'smooth'.
*/

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    
    // Ignora links vazios ou apenas "#"
    if (href === '#' || href === '') return;
    
    const target = document.querySelector(href);
    
    if (target) {
      e.preventDefault();
      
      // Calcula offset para não cobrir o header fixo
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});


/* ============================================
   6. NEWSLETTER FORM
   ============================================
   Previne o submit padrão e mostra feedback.
   Em produção, aqui você faria uma requisição
   para sua API/backend.
*/

const newsletterForm = document.getElementById('newsletterForm');


if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const emailInput = newsletterForm.querySelector('.newsletter-input');
    const email = emailInput.value;
    
    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
      alert('Por favor, insira um email válido.');
      return;
    }
    
    // Simulação de envio (em produção, use fetch)
    const submitBtn = newsletterForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Enviando...</span>';
    submitBtn.disabled = true;
    
    // Simula delay de rede
    setTimeout(() => {
      alert(`✅ Obrigado! O email ${email} foi inscrito com sucesso.`);
      
      // Reseta o form
      newsletterForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1000);
  });
}


/* ============================================
   7. ANIMAÇÃO DOS CONTADORES (BÔNUS)
   ============================================
   Anima os números das estatísticas quando
   entram na viewport.
*/

function animateCounter(element, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing: easeOutExpo
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (target - start) * easeOut);
    
    element.textContent = current;
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }
  
  requestAnimationFrame(update);
}

// Observa elementos com data-count
const counterElements = document.querySelectorAll('[data-count]');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      animateCounter(el, target);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

counterElements.forEach(el => counterObserver.observe(el));


/* ============================================
   8. CONSOLE EASTER EGG
   ============================================
   Mensagem divertida para devs curiosos.
*/

console.log(
  '%c⚡ DevClub %c— A Escola das Profissões do Futuro',
  'background: linear-gradient(135deg, #4ADE80, #06B6D4); color: #0A0612; padding: 8px 16px; border-radius: 4px; font-weight: bold; font-size: 14px;',
  'color: #4ADE80; font-size: 14px; padding: 8px;'
);

console.log('%cQuer fazer parte? → devclub.com.br', 'color: #6B21A8; font-size: 12px;');


/* ============================================
   9. PERFORMANCE: LAZY LOADING
   ============================================
   Adiciona loading="lazy" em imagens que
   ainda não têm (boas práticas).
*/

document.querySelectorAll('img:not([loading])').forEach(img => {
  img.setAttribute('loading', 'lazy');
  img.setAttribute('alt', img.alt || 'Imagem do DevClub');
});


/* ============================================
   10. KEYBOARD NAVIGATION
   ============================================
   Suporte a navegação por teclado.
   Fecha menu mobile com ESC.
*/

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      menuToggle.classList.remove('active');
      document.body.style.overflow = '';
      menuToggle.focus();
    }
  }
});
/* ============================================
   SISTEMA DE MODAIS REMOVIDO
   ============================================
   O site agora fica apenas público.
   (Botão Login/Matricula e modais foram removidos do HTML.)
*/

