// Intersection Observer for Scroll Animations
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));

// Load Gallery Data
fetch('gallery-data.json')
    .then(response => response.json())
    .then(data => {
        const personaGrid = document.getElementById('persona-grid');
        const publicGrid = document.getElementById('public-grid');

        const createItem = (photo) => {
            const container = document.createElement('div');
            container.className = "group relative overflow-hidden rounded-lg cursor-pointer aspect-[3/4] bg-gray-900";
            container.innerHTML = `
                <img src="${photo.filename}" loading="lazy" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p class="text-[9px] text-purple-400 tracking-widest uppercase font-bold">${photo.caption}</p>
                </div>
            `;
            container.onclick = () => openModal(photo.filename);
            return container;
        };

        // Populate Persona (7 images)
        data.persona.forEach(photo => personaGrid.appendChild(createItem(photo)));

        // Populate Public Appearance (18 images)
        data.public.forEach(photo => publicGrid.appendChild(createItem(photo)));
    })
    .catch(err => console.error("Gallery failed to load:", err));

// Modal Controls
function openModal(src) {
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    modalImg.src = src;
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.add('active'), 10);
}

document.getElementById('close-modal').onclick = () => {
    const modal = document.getElementById('image-modal');
    modal.classList.remove('active');
    setTimeout(() => modal.classList.add('hidden'), 300);
};
