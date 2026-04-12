document.addEventListener("DOMContentLoaded", () => {
    // 1. INITIALIZE ICONS
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. LOAD GALLERY IMAGES
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


    // 3. LOAD INSTAGRAM REELS
    const videoGrid = document.getElementById('video-grid');

    // Try primary filename first, then fallback
    const videoFiles = ['video-data.json', 'videos-data (1).json'];
    
    function loadVideos(index) {
        if (index >= videoFiles.length) return;

        fetch(videoFiles[index])
        .then(res => {
            if (!res.ok) throw new Error("File not found");
            return res.json();
        })
        .then(data => {
            if (!videoGrid) return;
            videoGrid.innerHTML = '';

            data.reels.forEach(reel => {
                const wrapper = document.createElement('div');
                // Professional styling for the reel container
                wrapper.className = "w-full flex justify-center bg-white/5 rounded-xl overflow-hidden border border-white/10";
                wrapper.style.minHeight = "480px";

                wrapper.innerHTML = `
                    <blockquote class="instagram-media"
                        data-instgrm-permalink="${reel.url}"
                        data-instgrm-version="14"
                        style="width:100%; max-width:540px; margin:0; border:0; padding:0;">
                    </blockquote>
                `;
                videoGrid.appendChild(wrapper);
            });

            // Trigger the Instagram embed script to render the videos
            renderInstagram();
        })
        .catch(() => loadVideos(index + 1));
    }

    loadVideos(0);

    // 4. MODAL LOGIC
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

// INSTAGRAM RENDER ENGINE
function renderInstagram() {
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
