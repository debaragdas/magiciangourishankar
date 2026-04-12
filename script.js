document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE ICONS
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. SCROLL ANIMATION LOGIC
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

    // 3. LOAD IMAGE GALLERIES
    // Ensure the filename here matches your gallery JSON file exactly
    fetch('gallery-data.json')
        .then(res => {
            if (!res.ok) throw new Error('gallery-data.json not found');
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
                         alt="${photo.caption}"
                         class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
                         onerror="this.src='https://via.placeholder.com/400x600?text=Image+Missing'">
                `;
                div.onclick = () => openModal(photo.filename);
                return div;
            };

            if (data.persona && personaGrid) {
                data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
            }
            
            if (data.public && publicGrid) {
                data.public.forEach(p => publicGrid.appendChild(createCard(p)));
            }
        })
        .catch(err => console.error("Gallery Error:", err));

    // 4. LOAD INSTAGRAM REELS
    // IMPORTANT: I changed this to match the filename you uploaded
    fetch('videos-data (1).json') 
        .then(res => {
            if (!res.ok) throw new Error('videos-data (1).json not found');
            return res.json();
        })
        .then(data => {
            const videoGrid = document.getElementById('video-grid');
            if (!videoGrid) return;
            
            videoGrid.innerHTML = ''; 

            data.reels.forEach(reel => {
                const div = document.createElement('div');
                div.className = "flex justify-center min-h-[450px] w-full bg-white/5 rounded-xl overflow-hidden"; 
                div.innerHTML = `
                    <blockquote class="instagram-media" 
                                data-instgrm-permalink="${reel.url}" 
                                data-instgrm-version="14" 
                                style="width:100%; border:0; margin:0;">
                    </blockquote>
                `;
                videoGrid.appendChild(div);
            });

            refreshInstagram();
        })
        .catch(err => console.error("Video Error:", err));

    // 5. MODAL LOGIC
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

function refreshInstagram() {
    const checkInterval = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(checkInterval);
        }
    }, 500);
    setTimeout(() => clearInterval(checkInterval), 10000);
}
