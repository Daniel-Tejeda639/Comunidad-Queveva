document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // CONFIGURACIÓN DE LA GALERÍA  (esto es lo único que tienes que tocar)
    // --------------------------------------------------------------------------
    // Las fotos viven en la carpeta img/ y se llaman foto1.jpeg, foto2.jpeg, ...
    // Si algún día agregas más fotos, sube foto22.jpeg, foto23.jpeg... y
    // aumenta este número.
    // ==========================================================================
    const TOTAL_FOTOS = 21;

    // Opcional: texto personalizado para una foto. Si no escribes nada,
    // se muestra "Fotografía N". Ejemplo:
    //   15: 'Descripción de la foto 15',
    const PIES_DE_FOTO = {
        // 1: 'Vista del territorio',
    };


    // 1. AÑO ACTUAL AUTOMÁTICO EN EL FOOTER
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();


    // 2. GENERACIÓN DINÁMICA DE LA GALERÍA
    const galleryGrid = document.getElementById('gallery-grid');

    function textoDeFoto(n) {
        return PIES_DE_FOTO[n] || `Fotografía ${n}`;
    }

    if (galleryGrid) {
        for (let i = 1; i <= TOTAL_FOTOS; i++) {
            const item = document.createElement('div');
            item.classList.add('gallery-item');
            item.setAttribute('data-foto', i);
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', `Ampliar ${textoDeFoto(i)}`);

            item.innerHTML = `
                <img src="img/foto${i}.jpeg" alt="${textoDeFoto(i)} - Comunidad Queveva" loading="lazy">
                <div class="gallery-overlay">
                    <div class="gallery-info">
                        <span>${textoDeFoto(i)}</span>
                    </div>
                </div>
            `;

            // Si una foto aún no está subida, se omite sin dejar un hueco roto
            item.querySelector('img').addEventListener('error', () => item.remove());

            galleryGrid.appendChild(item);
        }
    }


    // 3. MENÚ DE NAVEGACIÓN MÓVIL (HAMBURGER)
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    function setMenu(open) {
        if (!navToggle || !navMenu) return;
        navMenu.classList.toggle('open', open);
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            setMenu(!navMenu.classList.contains('open'));
        });

        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => setMenu(false));
        });
    }


    // 4. ENCABEZADO QUE CAMBIA AL HACER SCROLL + ENLACE ACTIVO DEL MENÚ
    const header = document.querySelector('.main-header');
    const navLinks = Array.from(document.querySelectorAll('.nav-menu a'));
    const sections = navLinks
        .map(a => document.querySelector(a.getAttribute('href')))
        .filter(Boolean);

    function onScroll() {
        if (header) header.classList.toggle('scrolled', window.scrollY > 40);

        const marca = window.scrollY + window.innerHeight * 0.35;
        let actual = sections[0];
        sections.forEach(sec => {
            if (sec.offsetTop <= marca) actual = sec;
        });
        navLinks.forEach(a => {
            a.classList.toggle('active', actual && a.getAttribute('href') === `#${actual.id}`);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();


    // 5. ANIMACIONES DE ENTRADA AL HACER SCROLL
    const animados = document.querySelectorAll('.reveal, .gallery-item');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        animados.forEach(el => observer.observe(el));
    } else {
        animados.forEach(el => el.classList.add('visible'));
    }


    // 6. SISTEMA DE AMPLIACIÓN DE IMÁGENES (LIGHTBOX)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');

    let fotosVisibles = [];   // fotos que realmente existen, en orden
    let posicion = 0;

    function showLightbox(pos) {
        if (!lightbox || !lightboxImg || !lightboxCaption || !fotosVisibles.length) return;
        posicion = (pos + fotosVisibles.length) % fotosVisibles.length;
        const numero = fotosVisibles[posicion];
        lightboxImg.src = `img/foto${numero}.jpeg`;
        lightboxImg.alt = `${textoDeFoto(numero)} - Comunidad Queveva`;
        lightboxCaption.textContent =
            `${textoDeFoto(numero)} · ${posicion + 1} de ${fotosVisibles.length} — Comunidad Queveva`;
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function abrirDesdeItem(item) {
        fotosVisibles = Array.from(document.querySelectorAll('.gallery-item'))
            .map(el => parseInt(el.getAttribute('data-foto'), 10));
        const numero = parseInt(item.getAttribute('data-foto'), 10);
        showLightbox(fotosVisibles.indexOf(numero));
    }

    document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');
        if (item) abrirDesdeItem(item);
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (nextBtn) nextBtn.addEventListener('click', () => showLightbox(posicion + 1));
    if (prevBtn) prevBtn.addEventListener('click', () => showLightbox(posicion - 1));

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        // Deslizar con el dedo en el celular
        let inicioX = null;
        lightbox.addEventListener('touchstart', (e) => {
            inicioX = e.changedTouches[0].clientX;
        }, { passive: true });
        lightbox.addEventListener('touchend', (e) => {
            if (inicioX === null) return;
            const dx = e.changedTouches[0].clientX - inicioX;
            if (Math.abs(dx) > 50) showLightbox(posicion + (dx < 0 ? 1 : -1));
            inicioX = null;
        }, { passive: true });
    }

    // Teclado: abrir foto con Enter/Espacio y navegar el visor
    document.addEventListener('keydown', (e) => {
        const enFoto = document.activeElement && document.activeElement.classList.contains('gallery-item');
        if (enFoto && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            abrirDesdeItem(document.activeElement);
            return;
        }

        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showLightbox(posicion + 1);
        if (e.key === 'ArrowLeft') showLightbox(posicion - 1);
    });
});
