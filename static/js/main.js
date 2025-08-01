/* ============================================= */
/*               CORE NAVIGATION                 */
/* ============================================= */

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
    nav.style.backgroundColor = 'transparent';
    nav.style.padding = '0px 0';
    } else {
    nav.style.backgroundColor = 'transparent';
    nav.style.padding = '0px 0';
    }
});
  // Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
    });
    });
});
  /* ============================================= */
  /*               MODAL FUNCTIONS                 */
  /* ============================================= */
function openModal(src) {
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modalImg");
    
    modalImg.src = src;
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    const modal = document.getElementById("modal");
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

  // Make modal functions globally available
window.openModal = openModal;
window.closeModal = closeModal;
// Modal para el CV
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del modal
    const previewBtn = document.querySelector('.cv-preview-btn');
    const modal = document.getElementById('cv-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeBtn = document.querySelector('.close-btn');

    // Abrir modal al hacer clic en el botón de preview
    previewBtn.addEventListener('click', function() {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Previene el scroll
    });

    // Cerrar modal con los botones de cerrar
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restaura el scroll
    }

    closeModalBtn.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Cerrar con la tecla ESC
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
});
// Hamburguesa Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
        
        // Bloquear el scroll cuando el menú está abierto
        document.body.style.overflow = !isExpanded ? 'hidden' : '';
    });
    
    // Cerrar menú al hacer clic en un enlace (para móviles)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.setAttribute('aria-expanded', 'false');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
});