document.addEventListener('DOMContentLoaded', () => {
    const PASSWORD_ADMIN = "sanpablo123";
    let esAdmin = sessionStorage.getItem("admin") === "true";

    const form = document.getElementById('form');
    const listaNoticias = document.getElementById('lista');
    const buscador = document.getElementById('buscador');
    const btnAdmin = document.getElementById('btnAdmin');
    const btnLogout = document.getElementById('btnLogout');
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImg');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');

    let currentImageList = [];
    let currentImageIndex = 0;

    let noticias = JSON.parse(localStorage.getItem('noticias_sanpablo')) || [
        { id: 'init1', titulo: 'Ofrenda en la Milpa', contenido: 'Se invita a las familias al convivio con la madre tierra para agradecer la cosecha de maíz y frijol.' },
        { id: 'init2', titulo: 'Rescate de las Danzas', contenido: 'Convocatoria abierta para jóvenes interesados en aprender la Danza de las Varitas (Tlancuancoyolmej).' },
        { id: 'init3', titulo: 'Limpieza de Norias', contenido: 'Jornada de faena comunitaria este domingo para preparar la Fiesta del Pozo y los rituales del agua.' },
        { id: 'init4', titulo: 'Muestra Gastronómica', contenido: 'Degustación de Patlache y Tamal de Zarabanda en la plaza principal tras el ritual del Yuco.' },
        { id: 'init5', titulo: 'Encuentro de Músicos', contenido: 'Invitación a los antiguos músicos de la comunidad para rescatar las 7 melodías sagradas de nuestra cultura.' }
    ];

    noticias = noticias.map(n => n.id ? n : { ...n, id: Date.now() + Math.random().toString(36) });

    const guardarStorage = () => localStorage.setItem('noticias_sanpablo', JSON.stringify(noticias));

    function actualizarUIAdmin() {
        if (btnLogout) btnLogout.style.display = esAdmin ? 'inline-block' : 'none';
        if (btnAdmin) btnAdmin.style.display = esAdmin ? 'none' : 'inline-block';
    }
    actualizarUIAdmin();

    if (btnAdmin) {
        btnAdmin.addEventListener('click', () => {
            const pass = prompt("Ingresa contraseña de administrador:");
            if (pass === PASSWORD_ADMIN) {
                esAdmin = true;
                sessionStorage.setItem("admin", "true");
                alert("Modo administrador activado");
                actualizarUIAdmin();
                renderizarNoticias();
            } else if (pass !== null) {
                alert("Contraseña incorrecta");
            }
        });
    }

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            sessionStorage.removeItem("admin");
            esAdmin = false;
            alert("Sesión cerrada");
            actualizarUIAdmin();
            renderizarNoticias();
        });
    }

    function renderizarNoticias(filtro = '') {
        if (!listaNoticias) return;
        listaNoticias.innerHTML = '';
        const filtradas = noticias.filter(n => 
            n.titulo.toLowerCase().includes(filtro.toLowerCase()) ||
            n.contenido.toLowerCase().includes(filtro.toLowerCase())
        );

        if (filtradas.length === 0) {
            listaNoticias.innerHTML = `<div class="card" style="text-align:center; opacity:0.7;"><p>No se encontraron noticias.</p></div>`;
            return;
        }

        filtradas.forEach((noticia) => {
            const div = document.createElement('div');
            div.className = 'card noticia-card';
            div.innerHTML = `
                <h3 style="color: var(--cafe-profundo);">${noticia.titulo}</h3>
                <p>${noticia.contenido}</p>
                ${esAdmin ? `<button class="btnEliminar" data-id="${noticia.id}" style="margin-top:15px;">🗑 Eliminar</button>` : ''}
                <small style="display:block; margin-top:15px; color:#888;">📍 San Pablo, Coxcatlán</small>
            `;
            listaNoticias.appendChild(div);
        });
    }

    renderizarNoticias();

    if (listaNoticias) {
        listaNoticias.addEventListener('click', (e) => {
            if (e.target.classList.contains('btnEliminar')) {
                const id = e.target.dataset.id;
                if (!confirm(`¿Eliminar esta noticia?`)) return;
                noticias = noticias.filter(n => n.id !== id);
                guardarStorage();
                renderizarNoticias(buscador ? buscador.value : '');
            }
        });
    }

    let isSubmitting = false;
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (isSubmitting) return;

            const respuestaInput = document.getElementById('respuestaLocal');
            const tituloInput = document.getElementById('titulo');
            const contenidoInput = document.getElementById('contenido');
            
            if (!respuestaInput || !tituloInput || !contenidoInput) return;

            const respuesta = respuestaInput.value.trim().toLowerCase();
            const respuestasValidas = ["san pablo", "san pablo coxcatlán", "san pablo coxcatlan"];
            if (!respuestasValidas.includes(respuesta)) {
                alert("Por favor, ingresa el nombre correcto de la comunidad.");
                return;
            }

            const titulo = tituloInput.value.trim();
            const contenido = contenidoInput.value.trim();
            if (!titulo || !contenido) return;

            isSubmitting = true;
            const nuevaNoticia = {
                id: Date.now() + '-' + Math.random().toString(36),
                titulo,
                contenido
            };
            noticias.unshift(nuevaNoticia);
            guardarStorage();
            form.reset();
            renderizarNoticias(buscador ? buscador.value : '');
            isSubmitting = false;
        });
    }

    if (buscador) {
        buscador.addEventListener('input', (e) => renderizarNoticias(e.target.value));
    }

    function abrirModalDesdeLista(listaImagenes, indexInicial = 0) {
        currentImageList = listaImagenes.filter(src => src && src.trim() !== '');
        if (currentImageList.length === 0) return;
        currentImageIndex = Math.min(indexInicial, currentImageList.length - 1);
        mostrarImagenActual();
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    function mostrarImagenActual() {
        if (currentImageList.length > 0 && modalImg) {
            modalImg.src = currentImageList[currentImageIndex];
            modalImg.alt = `Imagen ${currentImageIndex + 1} de ${currentImageList.length}`;
        }
    }

    function siguienteImagen() {
        if (currentImageList.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % currentImageList.length;
        mostrarImagenActual();
    }

    function anteriorImagen() {
        if (currentImageList.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + currentImageList.length) % currentImageList.length;
        mostrarImagenActual();
    }

    function cerrarModal() {
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        currentImageList = [];
    }

    document.addEventListener('click', (e) => {
        const imgElement = e.target.closest('img');
        if (!imgElement) return;

        const galeriaItem = imgElement.closest('.galeria-item');
        if (!galeriaItem) return; 

        const dataImages = galeriaItem.dataset.images;
        if (dataImages) {
            const imagenes = dataImages.split(',').map(s => s.trim());
            const srcActual = imgElement.getAttribute('src');
            let index = imagenes.indexOf(srcActual);
            if (index === -1) index = 0;
            abrirModalDesdeLista(imagenes, index);
        } else {
            abrirModalDesdeLista([imgElement.src], 0);
        }
        e.preventDefault();
    });

    if (prevBtn) prevBtn.addEventListener('click', anteriorImagen);
    if (nextBtn) nextBtn.addEventListener('click', siguienteImagen);
    if (closeModal) closeModal.addEventListener('click', cerrarModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cerrarModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (modal && modal.style.display === 'flex') {
            if (e.key === 'Escape') cerrarModal();
            if (e.key === 'ArrowLeft') anteriorImagen();
            if (e.key === 'ArrowRight') siguienteImagen();
        }
    });

    if (modalImg) {
        modalImg.addEventListener('error', () => {
            modalImg.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'150\' viewBox=\'0 0 200 150\'%3E%3Crect width=\'200\' height=\'150\' fill=\'%23ddd\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' dominant-baseline=\'middle\' text-anchor=\'middle\' font-family=\'sans-serif\' fill=\'%23999\'%3EImagen no disponible%3C/text%3E%3C/svg%3E';
            modalImg.alt = 'Imagen no encontrada';
        });
    }

    const header = document.querySelector('header');
    const headerOffset = header ? header.offsetHeight : 70;
    const navLinks = document.querySelectorAll('nav a');
    const sections = document.querySelectorAll('section[id]');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    function activateNavLink() {
        const scrollPosition = window.scrollY + headerOffset + 100;

        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', activateNavLink);
    window.addEventListener('load', activateNavLink);
    window.addEventListener('resize', activateNavLink); 
});