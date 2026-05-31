document.addEventListener('DOMContentLoaded', () => {

    // 1. ESTABLECER AÑO ACTUAL EN EL FOOTER
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();


    // 2. RENDERIZADO DINÁMICO DE LAS 28 FOTOGRAFÍAS
    const galleryGrid = document.getElementById('gallery-grid');
    const totalImages = 28;

    for (let i = 1; i <= totalImages; i++) {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.setAttribute('data-index', i);
        
        item.innerHTML = `
            <img src="img/foto${i}.jpg" alt="Fotografía ${i} - Comunidad Queveva" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <span>Registro Fotográfico #${i}</span>
                </div>
            </div>
        `;
        galleryGrid.appendChild(item);
    }


    // 3. MENÚ MÓVIL (HAMBURGER)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    // Cerrar menú al dar clic en un enlace (Móvil)
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });


    // 4. LIGHTBOX SISTEMA DE AMPLIACIÓN DE IMÁGENES
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentImgIndex = 1;

    function showLightbox(index) {
        currentImgIndex = parseInt(index);
        lightboxImg.src = `img/foto${currentImgIndex}.jpg`;
        lightboxCaption.textContent = `Fotografía ${currentImgIndex} de ${totalImages} — Proyecto Especial Queveva`;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
    }

    function navigateLightbox(direction) {
        currentImgIndex += direction;
        if (currentImgIndex > totalImages) currentImgIndex = 1;
        if (currentImgIndex < 1) currentImgIndex = totalImages;
        showLightbox(currentImgIndex);
    }

    // Eventos del Lightbox
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            showLightbox(item.getAttribute('data-index'));
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    nextBtn.addEventListener('click', () => navigateLightbox(1));
    prevBtn.addEventListener('click', () => navigateLightbox(-1));

    // Cerrar si hace clic fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Soporte para navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
    });


    // 5. ANIMACIONES AL DESPLAZARSE (INTERSECTION OBSERVER)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Deja de observar una vez visible
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // 6. RESALTAR ENLACE DE NAVEGACIÓN ACTIVO AL HACER SCROLL
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 120; // Offset para el menú fijo

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });
});
