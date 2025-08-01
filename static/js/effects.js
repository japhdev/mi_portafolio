/* ============================================= */
/*               CERTIFICATES CAROUSEL           */
/* ============================================= */

document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initFigmaEffects();
    initTechTooltips();
});
function initCarousel() {
    const scroller = document.querySelector('.certificates-scroller');
    const prevBtn = document.querySelector('.scroll-btn.prev');
    const nextBtn = document.querySelector('.scroll-btn.next');
    
    if (!scroller || !prevBtn || !nextBtn) return;
    
    prevBtn.addEventListener('click', () => {
        scroller.scrollBy({ left: -300, behavior: 'smooth' });
    });
    
    nextBtn.addEventListener('click', () => {
        scroller.scrollBy({ left: 300, behavior: 'smooth' });
    });
    
    scroller.addEventListener('scroll', () => {
        prevBtn.style.display = scroller.scrollLeft > 0 ? 'block' : 'none';
        nextBtn.style.display = scroller.scrollLeft < (scroller.scrollWidth - scroller.clientWidth) ? 'block' : 'none';
    });
}

  /* ============================================= */
  /*               FIGMA EMBED EFFECTS             */
  /* ============================================= */
function initFigmaEffects() {
    const figmaContainer = document.querySelector('.figma-embed-wrapper');
    if (!figmaContainer) return;
    
    // Initial animation
    figmaContainer.style.opacity = '0';
    figmaContainer.style.clipPath = 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)';
    
    setTimeout(() => {
        figmaContainer.style.transition = 'opacity 0.8s ease, clip-path 1.2s ease';
        figmaContainer.style.opacity = '1';
        figmaContainer.style.clipPath = 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)';
    }, 300);
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
      const rotation = scrollPosition * 0.05;
        figmaContainer.style.transform = `translateZ(-20px) rotateX(${rotation}deg)`;
    });
}


