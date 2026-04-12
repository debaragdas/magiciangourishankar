document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // 1. ICON INIT
    // =========================
    if (window.lucide) {
        lucide.createIcons();
    }

    // =========================
    // 2. SCROLL ANIMATION
    // =========================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll')
        .forEach(el => observer.observe(el));


    // =========================
    // 3. LOAD IMAGE GALLERY
    // =========================
    const personaGrid = document.getElementById('persona-grid');
    const publicGrid = document.getElementById('public-grid');

    fetch('gallery-data.json')
        .then(res => {
            if (!res.ok) throw new Error('Gallery JSON not found');
            return res.json();
        })
        .then(data => {

            const createCard = (photo) => {
                const div = document.createElement('div');
                div.className = "img-card cursor-pointer group";

                div.innerHTML = `
                    <img src="${photo.filename}" 
                         alt="${photo.caption}" 
                         loading="lazy"
                         class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                         onerror="this.src='https://via.placeholder.com/400x600?text=Image+Missing'">
                `;

                div.onclick = () => openModal(photo.filename);
                return div;
            };

            // Clear loading text
            if (personaGrid) personaGrid.innerHTML = '';
            if (publicGrid) publicGrid.innerHTML = '';

            if (data.persona && personaGrid) {
                data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
            }

            if (data.public && publicGrid) {
                data.public.forEach(p => publicGrid.appendChild(createCard(p)));
            }

        })
        .catch(err => {
            console.error("Gallery Error:", err);

            if (personaGrid) {
                personaGrid.innerHTML = `<p class="text-red-400 text-center col-span-full">Failed to load images</p>`;
            }

            if (publicGrid) {
                publicGrid.innerHTML = `<p class="text-red-400 text-center col-span-full">Failed to load images</p>`;
            }
        });


    // =========================
    // 4. LOAD INSTAGRAM REELS
    // =========================
    const videoGrid = document.getElementById('video-grid');

    fetch('videos-data (1).json') // ✅ FIXED NAME
        .then(res => {
            if (!res.ok) throw new Error('Video JSON not found');
            return res.json();
        })
        .then(data => {

            if (!videoGrid) return;

            videoGrid.innerHTML = '';

            data.reels.forEach(reel => {
                const div = document.createElement('div');

                div.className = "flex justify-center min-h-[450px] w-full bg-white/5 rounded-xl overflow-hidden";

                div.innerHTML = `
                    <blockquote class="instagram-media"
                        data-instgrm-permalink="${reel.url}"
                        data-instgrm-version="14"
                        style="width:100%; margin:0;">
                    </blockquote>
                `;

                videoGrid.appendChild(div);
            });

            loadInstagramEmbeds();

        })
        .catch(err => {
            console.error("Video Error:", err);

            if (videoGrid) {
                videoGrid.innerHTML = `<p class="text-red-400 text-center col-span-full">Failed to load reels</p>`;
            }
        });


    // =========================
    // 5. MODAL
    // =========================
    window.openModal = function(src) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');

        if (modal && modalImg) {
            modalImg.src = src;
            modal.classList.remove('hidden');
            setTimeout(() => modal.classList.add('active'), 10);
        }
    };

    const closeBtn = document.getElementById('close-modal');
    if (closeBtn) {
        closeBtn.onclick = () => {
            const modal = document.getElementById('image-modal');
            modal.classList.remove('active');
            setTimeout(() => modal.classList.add('hidden'), 300);
        };
    }

});


// =========================
// 6. INSTAGRAM EMBED FIX
// =========================
function loadInstagramEmbeds() {
    let tries = 0;

    const interval = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(interval);
        }

        tries++;
        if (tries > 20) clearInterval(interval);

    }, 500);
}
