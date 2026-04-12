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
                         class="w-full h-full object-cover transition duration-500 group-hover:scale-110"
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
        .catch(err => console.error("Gallery Load Error:", err));

    // 3. LOAD INSTAGRAM REELS
    const videoGrid = document.getElementById('video-grid');
    
    fetch('video-data.json')
        .then(res => {
            if (!res.ok) throw new Error('video-data.json not found');
            return res.json();
        })
        .then(data => {
            if (!videoGrid) return;
            videoGrid.innerHTML = ''; 

            data.reels.forEach(reel => {
                const div = document.createElement('div');
                // Styling for professional grid item
                div.className = "flex justify-center min-h-[450px] w-full bg-white/5 rounded-2xl overflow-hidden border border-white/5"; 
                div.innerHTML = `
                    <blockquote class="instagram-media" 
                                data-instgrm-permalink="${reel.url}" 
                                data-instgrm-version="14" 
                                style="width:100%; border:0; margin:0; padding:0;">
                    </blockquote>
                `;
                videoGrid.appendChild(div);
            });

            // Start the Instagram engine to process the new blocks
            processInstagram();
        })
        .catch(err => {
            console.error("Video Load Error:", err);
            if (videoGrid) videoGrid.innerHTML = `<p class="text-gray-500 text-center col-span-full py-10">Reels are being synchronized...</p>`;
        });

    // 4. MODAL LOGIC
    window.openModal = function(src) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-img');
        if (modal && modalImg) {
            modalImg.src = src;
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    };

    // Close modal on background click
    document.getElementById('image-modal')?.addEventListener('click', function() {
        this.classList.add('hidden');
        this.classList.remove('flex');
    });
});

/**
 * Robust Instagram Embed Processor
 * Ensures the Instagram engine runs after elements are injected into the DOM.
 * Includes a retry loop for better performance on mobile devices.
 */
function processInstagram() {
    let attempts = 0;
    const interval = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
            window.instgrm.Embeds.process();
            clearInterval(interval);
        }
        attempts++;
        if (attempts > 30) clearInterval(interval); // Timeout after 15 seconds
    }, 500);
}
