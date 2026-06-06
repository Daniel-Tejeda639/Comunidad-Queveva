document.addEventListener('DOMContentLoaded', () => {

    // 1. AÑO ACTUAL AUTOMÁTICO EN EL FOOTER
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();


    // 2. GENERACIÓN DINÁMICA DE LA GALERÍA (14 IMÁGENES .JPEG)
    const galleryGrid = document.getElementById('gallery-grid');
    const totalImages = 14; // Cambiar a 28 si subes las 28 fotos completas

    if (galleryGrid) {
        for (let i = 1; i <= totalImages; i++) {
            const item = document.createElement('div');
            item.classList.add('gallery-item');
            item.setAttribute('data-index', i);

            item.innerHTML = `
                <img src="img/foto${i}.jpeg" alt="Fotografía ${i} - Comunidad Queveva" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <span>Fotografía ${i}</span>
                    </div>
                </div>
            `;
            galleryGrid.appendChild(item);
        }
    }


    // 3. MENÚ DE NAVEGACIÓN MÓVIL (HAMBURGER)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        // Cerrar menú al hacer clic en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }


    // 4. SISTEMA DE AMPLIACIÓN DE IMÁGENES (LIGHTBOX)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let currentImgIndex = 1;

    function showLightbox(index) {
        if (!lightbox || !lightboxImg || !lightboxCaption) return;
        currentImgIndex = parseInt(index);
        lightboxImg.src = `img/foto${currentImgIndex}.jpeg`;
        lightboxCaption.textContent = `Fotografía ${currentImgIndex} de ${totalImages} — Comunidad Queveva`;
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
    }

    function navigateLightbox(direction) {
        currentImgIndex += direction;
        if (currentImgIndex > totalImages) currentImgIndex = 1;
        if (currentImgIndex < 1) currentImgIndex = totalImages;
        showLightbox(currentImgIndex);
    }

    // Delegación de eventos para abrir imágenes
    document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) {
            showLightbox(item.getAttribute('data-index'));
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', () => navigateLightbox(1));
    if (prevBtn) prevBtn.addEventListener('click', () => navigateLightbox(-1));

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Navegación mediante teclado
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') navigateLightbox(1);
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
    });
});
