document.addEventListener('DOMContentLoaded', () => {

    // AÑO ACTUAL
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();

    // GALERÍA DE 14 FOTOS
    const galleryGrid = document.getElementById('gallery-grid');
    const totalImages = 14;

    for (let i = 1; i <= totalImages; i++) {
        const item = document.createElement('div');
        item.classList.add('gallery-item');
        item.setAttribute('data-index', i);

        item.innerHTML = `
            <img src="img/foto${i}.jpg" alt="Fotografía ${i} - Comunidad Queveva" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <span>Fotografía ${i}</span>
                </div>
            </div>
        `;

        galleryGrid.appendChild(item);
    }

    // LIGHTBOX
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
        lightboxCaption.textContent =
            `Fotografía ${currentImgIndex} de ${totalImages}`;
        lightbox.classList.add('active');
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
    }

    function navigateLightbox(direction) {
        currentImgIndex += direction;

        if (currentImgIndex > totalImages)
            currentImgIndex = 1;

        if (currentImgIndex < 1)
            currentImgIndex = totalImages;

        showLightbox(currentImgIndex);
    }

    document.addEventListener('click', (e) => {
        const item = e.target.closest('.gallery-item');

        if (item) {
            showLightbox(item.dataset.index);
        }
    });

    if (closeBtn)
        closeBtn.addEventListener('click', closeLightbox);

    if (nextBtn)
        nextBtn.addEventListener('click', () => navigateLightbox(1));

    if (prevBtn)
        prevBtn.addEventListener('click', () => navigateLightbox(-1));

});
