document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // 1. LOAD GALLERY IMAGES
    // =========================
    fetch('gallery-data.json')
    .then(res => {
        if (!res.ok) throw new Error("Gallery JSON not found");
        return res.json();
    })
    .then(data => {
        const personaGrid = document.getElementById('persona-grid');
        const publicGrid = document.getElementById('public-grid');

        const createCard = (img) => {
            const div = document.createElement('div');
            div.className = 'img-card cursor-pointer';
            div.innerHTML = `
                <img src="${img.filename}" 
                     class="w-full h-full object-cover"
                     loading="lazy"
                     onerror="this.src='https://via.placeholder.com/400x600?text=Image+Missing'">
            `;
            div.onclick = () => openModal(img.filename);
            return div;
        };

        if (personaGrid && data.persona) {
            personaGrid.innerHTML = '';
            data.persona.forEach(i => personaGrid.appendChild(createCard(i)));
        }

        if (publicGrid && data.public) {
            publicGrid.innerHTML = '';
            data.public.forEach(i => publicGrid.appendChild(createCard(i)));
        }
    })
    .catch(err => console.error("Gallery Error:", err));


    // =========================
    // 2. LOAD INSTAGRAM REELS (DYNAMIC FIX)
    // =========================
    const videoGrid = document.getElementById('video-grid');

    // We try to fetch the file. Note: Ensure your file is named video-data.json
    fetch('video-data.json')
    .then(res => res.json())
    .then(data => {
        if (!videoGrid) return;
        videoGrid.innerHTML = '';

        data.reels.forEach(reel => {
            const wrapper = document.createElement('div');
            wrapper.className = "w-full flex justify-center bg-white/5 rounded-xl overflow-hidden";
            wrapper.style.minHeight = "450px";

            wrapper.innerHTML = `
                <blockquote class="instagram-media"
                    data-instgrm-permalink="${reel.url}"
                    data-instgrm-version="14"
                    style="width:100%; max-width:540px; margin:0; border:0;">
                </blockquote>
            `;
            videoGrid.appendChild(wrapper);
        });

        // Trigger Instagram to turn blockquotes into actual videos
        renderInstagram();
    })
    .catch(err => {
        console.warn("Retrying with backup filename...");
        // Fallback for the specific filename you uploaded
        fetch('videos-data (1).json')
        .then(res => res.json())
        .then(data => {
            videoGrid.innerHTML = '';
            data.reels.forEach(reel => {
                const wrapper = document.createElement('div');
                wrapper.className = "w-full flex justify-center bg-white/5 rounded-xl overflow-hidden";
                wrapper.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${reel.url}" data-instgrm-version="14" style="width:100%;"></blockquote>`;
                videoGrid.appendChild(wrapper);
            });
            renderInstagram();
        });
    });


    // =========================
    // 3. MODAL LOGIC
    // =========================
    window.openModal = function(src) {
        const modal = document.getElementById('image-modal');
        const img = document.getElementById('modal-img');
        if (modal && img) {
            img.src = src;
            modal.classList.remove('hidden');
        }
    };

    document.getElementById('image-modal')?.addEventListener('click', function() {
        this.classList.add('hidden');
    });

});

// =========================
// INSTAGRAM RENDER ENGINE
// =========================
function renderInstagram() {
    let attempts = 0;
    const interval = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(interval);
        }
        attempts++;
        if (attempts > 30) clearInterval(interval); // Stop trying after 15 seconds
    }, 500);
}
