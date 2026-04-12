document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // 1. INIT ICONS
    // =========================
    if (window.lucide) lucide.createIcons();


    // =========================
    // 2. LOAD GALLERY
    // =========================
    fetch('gallery-data.json')
        .then(res => {
            if (!res.ok) throw new Error('Gallery JSON not found');
            return res.json();
        })
        .then(data => {

            const personaGrid = document.getElementById('persona-grid');
            const publicGrid = document.getElementById('public-grid');

            const createCard = (photo) => {
                const div = document.createElement('div');
                div.className = "img-card cursor-pointer group";

                div.innerHTML = `
                    <img src="${photo.filename}" 
                         loading="lazy"
                         alt="${photo.caption || 'gallery image'}"
                         class="w-full h-full object-cover"
                         onerror="this.src='https://via.placeholder.com/400x600?text=Image+Missing'">
                `;

                div.onclick = () => openModal(photo.filename);
                return div;
            };

            if (data.persona && personaGrid) {
                personaGrid.innerHTML = '';
                data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
            }

            if (data.public && publicGrid) {
                publicGrid.innerHTML = '';
                data.public.forEach(p => publicGrid.appendChild(createCard(p)));
            }

        })
        .catch(err => console.warn("Gallery Error:", err));


    // =========================
    // 3. LOAD INSTAGRAM REELS
    // =========================
    const videoGrid = document.getElementById('video-grid');

    fetch('video-data.json')
        .then(res => {
            if (!res.ok) throw new Error('Video JSON not found');
            return res.json();
        })
        .then(data => {

            if (!videoGrid) return;

            videoGrid.innerHTML = '';

            data.reels.forEach(reel => {

                const div = document.createElement('div');
                div.className = "card flex justify-center items-center min-h-[450px]";

                div.innerHTML = `
                    <blockquote class="instagram-media"
                        data-instgrm-permalink="${reel.url}"
                        data-instgrm-version="14"
                        style="width:100%; margin:0;">
                    </blockquote>
                `;

                videoGrid.appendChild(div);
            });

            // PROCESS INSTAGRAM
            runInstagramEmbed();

        })
        .catch(err => {
            console.warn("Reels Error:", err);
            if (videoGrid) {
                videoGrid.innerHTML = `
                    <p class="text-gray-500 text-center col-span-full py-10">
                        Reels are loading...
                    </p>`;
            }
        });


    // =========================
    // 4. MODAL SYSTEM
    // =========================
    window.openModal = function(src) {
        const modal = document.getElementById('modal');
        const img = document.getElementById('modalImg');

        if (modal && img) {
            img.src = src;
            modal.style.display = "flex";
        }
    };

    document.getElementById('modal')?.addEventListener('click', function () {
        this.style.display = "none";
    });

});


// =========================
// 🔥 INSTAGRAM EMBED ENGINE
// =========================
function runInstagramEmbed() {

    let attempts = 0;

    const interval = setInterval(() => {

        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(interval);
        }

        attempts++;
        if (attempts > 30) clearInterval(interval);

    }, 500);
}


// =========================
// 💎 SCROLL ANIMATION (SAFE)
// =========================
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.fade').forEach(el => observer.observe(el));
});
