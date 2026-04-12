document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE ICONS
    if (window.lucide) {
        lucide.createIcons();
    }

    // 2. LOAD IMAGE GALLERIES
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
                         alt="${photo.caption}"
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
        .catch(err => console.error("Gallery Error:", err));

    // 3. LOAD INSTAGRAM REELS
    const videoGrid = document.getElementById('video-grid');
    
    // Check for both possible filenames
    const videoSource = 'videos-data (1).json'; 

    fetch(videoSource)
        .then(res => res.json())
        .then(data => {
            if (!videoGrid) return;
            videoGrid.innerHTML = ''; 

            data.reels.forEach(reel => {
                const div = document.createElement('div');
                div.className = "flex justify-center min-h-[480px] w-full bg-white/5 rounded-2xl overflow-hidden border border-white/5"; 
                div.innerHTML = `
                    <blockquote class="instagram-media" 
                                data-instgrm-permalink="${reel.url}" 
                                data-instgrm-version="14" 
                                style="width:100%; border:0; margin:0; padding:0;">
                    </blockquote>
                `;
                videoGrid.appendChild(div);
            });

            // Trigger the Instagram engine
            processInstagram();
        })
        .catch(err => {
            console.error("Video Load Error:", err);
            if(videoGrid) videoGrid.innerHTML = `<p class="text-gray-500 text-center col-span-full">Unable to load reels. Please refresh.</p>`;
        });

    // 4. MODAL LOGIC
    window.openModal = function(src) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        if (modal && modalImg) {
            modalImg.src = src;
            modal.classList.remove('hidden');
        }
    };

    // Close modal on click anywhere
    document.getElementById('image-modal')?.addEventListener('click', function() {
        this.classList.add('hidden');
    });
});

/**
 * Robust Instagram Embed Processor
 * Retries for 10 seconds until the Instagram script is ready
 */
function processInstagram() {
    let attempts = 0;
    const interval = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(interval);
        }
        attempts++;
        if (attempts > 20) clearInterval(interval); 
    }, 500);
}
