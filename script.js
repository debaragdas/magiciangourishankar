// Intersection Observer for Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
}, { threshold: 0.05 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// 1. Fetch Images (Persona & Public)
fetch('gallery-data.json')
    .then(res => res.json())
    .then(data => {
        const personaGrid = document.getElementById('persona-grid');
        const publicGrid = document.getElementById('public-grid');
        
        const createCard = (photo) => {
            const div = document.createElement('div');
            div.className = "img-card cursor-pointer group";
            div.innerHTML = `<img src="${photo.filename}" loading="lazy" class="w-full h-full object-cover transition duration-500 group-hover:scale-110">`;
            div.onclick = () => {
                document.getElementById('modal-img').src = photo.filename;
                document.getElementById('image-modal').classList.remove('hidden');
                document.getElementById('image-modal').classList.add('active');
            };
            return div;
        };

        if (data.persona) data.persona.forEach(p => personaGrid.appendChild(createCard(p)));
        if (data.public) data.public.forEach(p => publicGrid.appendChild(createCard(p)));
    })
    .catch(err => console.error("Error loading images:", err));

// 2. Fetch Reels and Force Instagram Embed
fetch('video-data.json')
    .then(res => res.json())
    .then(data => {
        const videoGrid = document.getElementById('video-grid');
        videoGrid.innerHTML = ''; 

        data.reels.forEach(reel => {
            const div = document.createElement('div');
            div.className = "flex justify-center min-h-[450px] w-full"; 
            div.innerHTML = `<blockquote class="instagram-media" data-instgrm-permalink="${reel.url}" data-instgrm-version="14" style="width:100%; border-radius:12px; background:#000; border:0; margin:0;"></blockquote>`;
            videoGrid.appendChild(div);
        });

        // Loop to wait for Instagram SDK to be ready before calling process
        const checkInstgrm = setInterval(() => {
            if (window.instgrm) {
                window.instgrm.Embeds.process();
                clearInterval(checkInstgrm);
            }
        }, 500);
    })
    .catch(err => console.error("Error loading reels:", err));

// Modal Close
document.getElementById('close-modal').onclick = () => {
    document.getElementById('image-modal').classList.remove('active');
    setTimeout(() => document.getElementById('image-modal').classList.add('hidden'), 300);
};

// Initialize Lucide Icons
lucide.createIcons();
