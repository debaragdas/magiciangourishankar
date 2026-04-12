document.addEventListener("DOMContentLoaded",()=>{

// IMAGE LOAD
fetch('gallery-data.json')
.then(res=>res.json())
.then(data=>{
const p=document.getElementById('persona-grid');
const g=document.getElementById('public-grid');

const card=(img)=>{
let d=document.createElement('div');
d.className='img-card';
d.innerHTML=`<img src="${img.filename}" class="w-full h-full object-cover">`;
d.onclick=()=>{document.getElementById('image-modal').classList.remove('hidden');document.getElementById('modal-img').src=img.filename;}
return d;
};

p.innerHTML=''; g.innerHTML='';
data.persona.forEach(i=>p.appendChild(card(i)));
data.public.forEach(i=>g.appendChild(card(i)));
});

// VIDEO LOAD
fetch('video-data.json')
.then(res=>res.json())
.then(data=>{
const grid=document.getElementById('video-grid');
grid.innerHTML='';

data.reels.forEach(r=>{
let d=document.createElement('div');
d.innerHTML=`<iframe src="${r.url}embed" class="w-full h-[400px]"></iframe>`;
grid.appendChild(d);
});
})
.catch(()=>{document.getElementById('video-grid').innerHTML="Failed to load reels";});

});
