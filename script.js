/* ====================================================
   SCRIPT PRINCIPAL - GLOWUP
   ==================================================== */

// Quando o DOM está carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar tema salvo
    initTheme();
    // Configurar click handlers
    setupEventListeners();
    // Carregar tema salvo
    loadTheme();
});

/* ====================================================
   MENU HAMBÚRGUER - Mobile
   ==================================================== */

function setupEventListeners() {
    // Menu hambúrguer
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Fechar menu ao clicar num link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Tema claro/escuro
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Formulário de contato
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    // Formulário Newsletter
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

/* ====================================================
   TEMA CLARO/ESCURO
   ==================================================== */

function initTheme() {
    // Verificar preferência salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        updateThemeIcon('light');
    } else {
        // Respeitar a preferência do sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
            document.body.classList.add('light-theme');
            updateThemeIcon('light');
        }
    }
}

function loadTheme() {
    const currentTheme = localStorage.getItem('theme');
    const icon = document.getElementById('themeToggle');
    
    if (currentTheme === 'light') {
        icon.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        icon.innerHTML = '<i class="fas fa-moon"></i>';
    }
}

function toggleTheme() {
    const body = document.body;
    const isDarkMode = body.classList.contains('light-theme');
    const icon = document.getElementById('themeToggle');

    if (isDarkMode) {
        // Mudar para modo escuro
        body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
        icon.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
        // Mudar para modo claro
        body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
        icon.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeToggle');
    if (icon) {
        if (theme === 'light') {
            icon.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            icon.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
}

/* ====================================================
   ANIMAÇÕES COM SCROLL
   ==================================================== */

// Observar elementos para animações ao scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.8s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar cards de projetos e skills
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card, .skill-category, .experience-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.animationDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
});

/* ====================================================
   FORMULÁRIO DE CONTATO
   ==================================================== */

async function handleFormSubmit(e) {
    e.preventDefault();

    // Obter valores do formulário
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();
    const formMessage = document.getElementById('formMessage');

    // Validação simples
    if (!name || !email || !subject || !message) {
        showFormMessage('Por favor, preencha todos os campos.', 'error');
        return;
    }

    // Validação de email
    if (!isValidEmail(email)) {
        showFormMessage('Por favor, insira um email válido.', 'error');
        return;
    }

    // Aqui você pode enviar o email usando um serviço como EmailJS
    // Por enquanto, vamos apenas salvar no localStorage como exemplo
    
    try {
        // Dados do formulário
        const formData = {
            name,
            email,
            subject,
            message,
            date: new Date().toLocaleString('pt-BR')
        };

        // Salvar no localStorage como backup
        let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        messages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));

        // Limpar formulário
        document.getElementById('contactForm').reset();

        // Mostrar mensagem de sucesso
        showFormMessage(
            'Obrigado! Sua mensagem foi recebida. Vou responder em breve! 🎉',
            'success'
        );

        // Limpar mensagem após 3 segundos
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 3000);

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        showFormMessage(
            'Erro ao enviar mensagem. Tente novamente mais tarde.',
            'error'
        );
    }
}

function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/* ====================================================
   FORMULÁRIO NEWSLETTER
   ==================================================== */

function handleNewsletterSubmit(e) {
    e.preventDefault();

    const email = e.target.querySelector('input[type="email"]').value.trim();

    if (!isValidEmail(email)) {
        alert('Por favor, insira um email válido.');
        return;
    }

    // Salvar no localStorage
    let newsletters = JSON.parse(localStorage.getItem('newsletters') || '[]');
    newsletters.push({
        email,
        date: new Date().toLocaleString('pt-BR')
    });
    localStorage.setItem('newsletters', JSON.stringify(newsletters));

    // Limpar formulário e mostrar mensagem
    e.target.reset();
    const input = e.target.querySelector('input[type="email"]');
    input.style.borderColor = '#d968a0';
    
    setTimeout(() => {
        input.style.borderColor = '';
    }, 2000);

    console.log('✨ Inscrito com sucesso:', email);
}

/* ====================================================
   NAVEGAÇÃO SUAVE
   ==================================================== */

// Links de navegação com scroll suave (já existe nativamente no CSS)
// mas podemos adicionar comportamento extra se necessário

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            // Fechar menu mobile se estiver aberto
            const navMenu = document.getElementById('navMenu');
            const menuToggle = document.getElementById('menuToggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
});

/* ====================================================
   NAVBAR DINÂMICA - Mudar estilo ao scroll
   ==================================================== */

window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.boxShadow = 'var(--shadow-sm)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

/* ====================================================
   FUNÇÕES UTILITÁRIAS
   ==================================================== */

// Função para animar números (se necessário em futuro)
function animateValue(element, start, end, duration) {
    let startTimestamp = null;

    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };

    window.requestAnimationFrame(step);
}

// Detectar tema do sistema
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

prefersDark.addEventListener('change', (e) => {
    if (e.matches && localStorage.getItem('theme') === null) {
        document.body.classList.remove('light-theme');
    } else if (!e.matches && localStorage.getItem('theme') === null) {
        document.body.classList.add('light-theme');
    }
});

/* ====================================================
   EFEITO DE SCROLL PARALLAX (Opcional)
   ==================================================== */

window.addEventListener('scroll', () => {
    const floatingCard = document.querySelector('.floating-card');
    if (floatingCard && window.innerWidth > 768) {
        floatingCard.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    }
});

/* ====================================================
   VALIDAÇÃO E UTILITÁRIOS DE FORMULÁRIO
   ==================================================== */

// Adicionar validação em tempo real aos campos de email
const emailInput = document.getElementById('email');
if (emailInput) {
    emailInput.addEventListener('blur', () => {
        if (emailInput.value && !isValidEmail(emailInput.value)) {
            emailInput.style.borderColor = '#ef4444';
        } else {
            emailInput.style.borderColor = 'var(--border-color)';
        }
    });
}

/* ====================================================
   IMPRESSÃO DE CONSOLE (DEBUG)
   ==================================================== */

// Mensagem de boas-vindas no console
console.log(`
╔════════════════════════════════════════╗
║      Bem-vindo à GlowUp - Tudo 10     ║
║                                        ║
║  Maquiagem e Acessórios Femininos    ║
║                                        ║
║   Instagram: @glowuptudo10             ║
║   WhatsApp: (11) 9 9999-9999          ║
╚════════════════════════════════════════╝
`);

// Armazenar estatísticas de visitantes
function trackVisit() {
    let visits = JSON.parse(localStorage.getItem('portfolioVisits') || '0');
    visits = parseInt(visits) + 1;
    localStorage.setItem('portfolioVisits', visits);
    console.log(`📊 Você é o visitante #${visits}`);
}

// Chamar rastreamento
trackVisit();

/* ====================================================
   SERVICE WORKER PARA PWA (Opcional)
   ==================================================== */

// Registrar service worker se disponível
if ('serviceWorker' in navigator) {
    // Pode ser adicionado depois para funcionalidade offline
    // navigator.serviceWorker.register('sw.js');
}
