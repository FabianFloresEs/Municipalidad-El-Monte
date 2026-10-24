document.addEventListener('DOMContentLoaded', () => {

    /* =========================================
       MENÚ MÓVIL COMPARTIDO
    ========================================= */

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuPanel = document.getElementById('mobile-menu-panel');

    if (mobileMenuToggle && mobileMenuPanel) {

        const closeMobileMenu = () => {

            mobileMenuPanel.classList.remove('is-open');
            mobileMenuToggle.classList.remove('is-open');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
            mobileMenuToggle.setAttribute('aria-label', 'Abrir menú principal');
            mobileMenuPanel
                .querySelectorAll('.nav-item-has-submenu.mobile-open')
                .forEach(item => {item.classList.remove('mobile-open');});
        };

        mobileMenuToggle.addEventListener('click',() => {

                const isOpen = mobileMenuPanel.classList.toggle('is-open');
                mobileMenuToggle.classList.toggle('is-open', isOpen);
                mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
                mobileMenuToggle.setAttribute(
                    'aria-label',
                    isOpen
                        ? 'Cerrar menú principal'
                        : 'Abrir menú principal'
                );

        });

        /* Submenús en teléfono */
        mobileMenuPanel
            .querySelectorAll('.nav-item-has-submenu > a')
            .forEach(link => {

                link.addEventListener('click', event => {
                        if (window.innerWidth > 992) {return;}
                        event.preventDefault();
                        const parent = link.closest('.nav-item-has-submenu');
                        parent.classList.toggle('mobile-open');
                    }
                );

            });

        /* Cerrar con Escape */
        document.addEventListener('keydown', event => {
            if (event.key === 'Escape') {closeMobileMenu();}
        });

        /* Volver al estado normal al regresar
           a escritorio */
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) {closeMobileMenu();}
        });

    }
    
    /* =========================================
       LÓGICA DEL ACORDEÓN (Preguntas Frecuentes)
    ========================================= */
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            accordionHeaders.forEach(otherHeader => {
                otherHeader.setAttribute('aria-expanded', 'false');
                otherHeader.nextElementSibling.style.maxHeight = null;
                otherHeader.querySelector('.icon-plus').textContent = '+';
            });

            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
                const content = header.nextElementSibling;
                content.style.maxHeight = content.scrollHeight + "px";
                header.querySelector('.icon-plus').textContent = '−';
            }
        });
    });

    /* =========================================
       LÓGICA DEL CARRUSEL HERO
    ========================================= */
    const track = document.querySelector('.carousel-track');

    const slides = track ? Array.from(track.children) : [];

    const nextButton = document.querySelector('.carousel-button-right');

    const prevButton = document.querySelector('.carousel-button-left');

    const dotsNav = document.querySelector('.carousel-nav');

    const dots = dotsNav ? Array.from(dotsNav.children) : [];

    /*
    El carrusel solamente se inicializa
    cuando la página realmente lo contiene.
    */
    if (
        track &&
        slides.length > 0 &&
        nextButton &&
        prevButton &&
        dotsNav &&
        dots.length > 0
    ) {

        const slideWidth = slides[0].getBoundingClientRect().width;

        // Organizar los slides uno al lado del otro
        const setSlidePosition = (slide, index) => {
            slide.style.left = slideWidth * index + 'px';
        };
        slides.forEach(setSlidePosition);

        // Función para mover el carrusel
        const moveToSlide = (track, currentSlide, targetSlide) => {
            track.style.transform = 'translateX(-' + targetSlide.style.left + ')';
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        // Función para actualizar los puntos
        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-indicator');
            targetDot.classList.add('current-indicator');
        };

        // Mover a la derecha (Next)
        const moveToNext = () => {
            const currentSlide = track.querySelector('.current-slide');
            let nextSlide = currentSlide.nextElementSibling;
            const currentDot = dotsNav.querySelector('.current-indicator');
            let nextDot = currentDot.nextElementSibling;

            // Si llegamos al final, volver al primero
            if (!nextSlide) {
                nextSlide = slides[0];
                nextDot = dots[0];
            }

            moveToSlide(track, currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
        };

        // Mover a la izquierda (Prev)
        const moveToPrev = () => {
            const currentSlide = track.querySelector('.current-slide');
            let prevSlide = currentSlide.previousElementSibling;
            const currentDot = dotsNav.querySelector('.current-indicator');
            let prevDot = currentDot.previousElementSibling;

            // Si estamos en el primero, ir al último
            if (!prevSlide) {
                prevSlide = slides[slides.length - 1];
                prevDot = dots[dots.length - 1];
            }

            moveToSlide(track, currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
        };

        // Eventos de los botones laterales
        nextButton.addEventListener('click', () => {
            moveToNext();
            resetAutoPlay(); // Reiniciar el temporizador al hacer click manual
        });

        prevButton.addEventListener('click', () => {
            moveToPrev();
            resetAutoPlay(); // Reiniciar el temporizador al hacer click manual
        });

        // Evento de navegación por puntos
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            
            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-indicator');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            moveToSlide(track, currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
            resetAutoPlay(); // Reiniciar el temporizador al hacer click manual
        });

/* =========================================
============================================
============================================
============================================

            EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */
        // Cambio Automático (AutoPlay) cada 5 segundos
        let isCarouselPaused = false;
        let autoPlayInterval = setInterval(moveToNext, 5000);

        const stopAutoPlay = () => {
            isCarouselPaused = true;
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        };

        const resumeAutoPlay = () => {
            isCarouselPaused = false;
            clearInterval(autoPlayInterval);
            autoPlayInterval = setInterval(moveToNext, 5000);
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            if (!isCarouselPaused) {
                autoPlayInterval = setInterval(moveToNext, 5000);
            }
        };
/* =========================================
============================================
============================================
============================================

        TERMINO DE EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */

        // Recalcular posiciones si la ventana cambia de tamaño (Responsividad)
        window.addEventListener('resize', () => {
            const newSlideWidth = slides[0].getBoundingClientRect().width;
            slides.forEach((slide, index) => {
                slide.style.left = newSlideWidth * index + 'px';
            });
            // Ajustar el transform al slide actual
            const currentSlide = track.querySelector('.current-slide');
            track.style.transform = 'translateX(-' + currentSlide.style.left + ')';
        });

/* =========================================
============================================
============================================
============================================

            EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */
        /* =========================================
           BUSCADOR PRINCIPAL HERO (INDEX)
        ========================================= */
        const heroSearchForm = document.getElementById('hero-search-form');
        const heroSearchInput = document.getElementById('hero-search-input');
        const heroSearchDropdown = document.getElementById('hero-search-dropdown');

        if (heroSearchForm && heroSearchInput && heroSearchDropdown) {

            const searchCatalog = [
                {
                    title: 'Portal de Pagos',
                    desc: 'Permiso de circulación, patentes, aseo, multas y derechos municipales',
                    category: 'Pagos',
                    url: 'portal-pagos.html',
                    keywords: 'pagar pago pagos online permiso circulacion patentes aseo domiciliario multas partes derechos convenios causas'
                },
                {
                    title: 'Permiso de Circulación',
                    desc: 'Consulta y pago del permiso de circulación vehicular',
                    category: 'Trámites',
                    url: 'portal-pagos.html',
                    keywords: 'vehiculo auto patente circulacion transito'
                },
                {
                    title: 'Patentes Comerciales',
                    desc: 'Solicitud, renovación y pago de patentes municipales',
                    category: 'Trámites',
                    url: 'documentos-permisos.html',
                    keywords: 'comercio negocio local rentas patentes comercial'
                },
                {
                    title: 'Documentos, Certificados y Permisos',
                    desc: 'Certificados municipales, autorizaciones y uso de espacios',
                    category: 'Trámites',
                    url: 'documentos-permisos.html',
                    keywords: 'certificado certificados documento documentos permiso permisos autorizacion'
                },
                {
                    title: 'Concursos Públicos',
                    desc: 'Convocatorias laborales, bases y procesos de selección',
                    category: 'Convocatorias',
                    url: 'concursos-publicos.html',
                    keywords: 'trabajo empleo postulacion concurso concursos bases cargos'
                },
                {
                    title: 'Todos los Trámites Municipales',
                    desc: 'Directorio general de trámites y gestiones del municipio',
                    category: 'Trámites',
                    url: 'tramites.html',
                    keywords: 'tramite tramites gestion gestiones servicios'
                },
                {
                    title: 'DIDECO y Desarrollo Social',
                    desc: 'Registro Social de Hogares, subsidios, adulto mayor y asistencia social (2 2560 9757)',
                    category: 'Contacto',
                    url: 'contactos.html#panel-telefonos',
                    keywords: 'dideco social asistente ficha registro hogares subsidio adulto mayor discapacidad ayuda'
                },
                {
                    title: 'Dirección de Obras y Tránsito (DOM)',
                    desc: 'Obras municipales, licencias de conducir y aseo y ornato (2 2560 9723)',
                    category: 'Contacto',
                    url: 'contactos.html#panel-telefonos',
                    keywords: 'obras dom transito licencia conducir construccion aseo ornato vialidad'
                },
                {
                    title: 'Salud Municipal (CESFAM / CECOSF)',
                    desc: 'SOME CESFAM, OIRS, CECOSF Lo Chacón y El Paico (2 2574 3108)',
                    category: 'Salud',
                    url: 'contactos.html#panel-telefonos',
                    keywords: 'salud cesfam cecosf medico consultorio some oirs vacunacion sarampion ambulancia'
                },
                {
                    title: 'Agenda Telefónica Municipal',
                    desc: 'Directorio completo de teléfonos y horarios por departamento',
                    category: 'Contacto',
                    url: 'contactos.html#panel-telefonos',
                    keywords: 'telefono telefonos directorio anexo oficina oficinas contacto llamar horario'
                },
                {
                    title: 'Teléfonos de Emergencia y Seguridad',
                    desc: 'Ambulancia, Seguridad Ciudadana y Emergencia Municipal (+56 9 5217 1399)',
                    category: 'Emergencia',
                    url: 'contactos.html#panel-emergencias',
                    keywords: 'emergencia emergencias urgencia seguridad ciudadana ambulancia rescate denuncia'
                },
                {
                    title: 'Agenda Comunal',
                    desc: 'Próximas actividades, operativos en terreno y eventos del mes',
                    category: 'Noticias',
                    url: 'agenda-comunal.html',
                    keywords: 'agenda eventos actividades calendario operativo barrio feria laboral'
                },
                {
                    title: 'Comunicados Oficiales',
                    desc: 'Avisos de utilidad pública, campañas preventivas y cortes de tránsito',
                    category: 'Noticias',
                    url: 'comunicados.html',
                    keywords: 'comunicado comunicados avisos oficial adopcion perritos mascotas desvio corte'
                },
                {
                    title: 'Noticias Municipales',
                    desc: 'Actualidad comunal, obras, salud, cultura y medio ambiente',
                    category: 'Noticias',
                    url: 'noticias.html',
                    keywords: 'noticias noticia actualidad novedades talleres cultura deporte medio ambiente'
                },
                {
                    title: 'Alcaldía',
                    desc: 'Información de la Alcaldesa Zandra Maulén Jófre y funciones de Alcaldía',
                    category: 'Municipalidad',
                    url: 'alcaldia.html',
                    keywords: 'alcaldia alcaldesa autoridad zandra maulen'
                },
                {
                    title: 'Concejo Municipal',
                    desc: 'Integrantes y funciones del Concejo Municipal de El Monte',
                    category: 'Municipalidad',
                    url: 'concejo-municipal.html',
                    keywords: 'concejo concejales autoridades sesiones'
                },
                {
                    title: 'Nuestra Municipalidad y Direcciones',
                    desc: 'Organigrama, direcciones municipales e historia de El Monte',
                    category: 'Municipalidad',
                    url: 'municipalidad.html',
                    keywords: 'municipalidad municipio direcciones organigrama historia pladeco'
                },
                {
                    title: 'Oficina OMIL y Fomento Productivo',
                    desc: 'Bolsa de empleo, emprendimiento, turismo y Prodesal (4 4304 9386)',
                    category: 'Contacto',
                    url: 'contactos.html#panel-telefonos',
                    keywords: 'omil empleo trabajo fomento productivo turismo prodesal emprendimiento'
                },
                {
                    title: 'Juzgado de Policía Local',
                    desc: 'Consulta de causas, citaciones y atención presencial (4 4357 0327)',
                    category: 'Contacto',
                    url: 'contactos.html#panel-telefonos',
                    keywords: 'juzgado policia local multas causas citacion'
                }
            ];

            const normalizeText = text =>
                text
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '');

            let activeSuggestionIndex = -1;
            let currentMatches = [];

            const closeSuggestions = () => {
                heroSearchDropdown.hidden = true;
                heroSearchInput.setAttribute('aria-expanded', 'false');
                dotsNav.style.visibility = '';
                dotsNav.style.opacity = '';
                dotsNav.style.pointerEvents = '';
            };

            const renderSuggestions = query => {
                const normalizedQuery = normalizeText(query.trim());

                if (!normalizedQuery) {
                    closeSuggestions();
                    currentMatches = [];
                    activeSuggestionIndex = -1;
                    return;
                }

                const terms = normalizedQuery.split(/\s+/).filter(Boolean);

                currentMatches = searchCatalog.filter(item => {
                    const searchable = normalizeText(`${item.title} ${item.desc} ${item.category} ${item.keywords}`);
                    return terms.every(term => searchable.includes(term));
                });

                activeSuggestionIndex = -1;

                if (currentMatches.length === 0) {

                    const emptyMessage = document.createElement('div');
                    emptyMessage.className = 'hero-search-empty';

                    const searchTerm = document.createElement('strong');
                    searchTerm.textContent = query.trim();

                    emptyMessage.append(
                        'No se encontraron resultados para "',
                        searchTerm,
                        '".'
                    );

                    heroSearchDropdown.replaceChildren(emptyMessage);

                } else {
                    heroSearchDropdown.innerHTML = currentMatches
                        .slice(0, 6)
                        .map((item, index) => `
                            <a href="${item.url}" class="hero-search-item" role="option" data-index="${index}">
                                <div class="hero-search-item-main">
                                    <span class="hero-search-item-title">${item.title}</span>
                                    <span class="hero-search-item-desc">${item.desc}</span>
                                </div>
                                <span class="hero-search-item-badge">${item.category}</span>
                            </a>
                        `)
                        .join('');
                }

                heroSearchDropdown.hidden = false;
                heroSearchInput.setAttribute('aria-expanded', 'true');
                dotsNav.style.visibility = 'hidden';
                dotsNav.style.opacity = '0';
                dotsNav.style.pointerEvents = 'none';
            };

            const updateActiveOption = items => {
                items.forEach((el, idx) => {
                    el.classList.toggle('is-active', idx === activeSuggestionIndex);
                });
                if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
                    items[activeSuggestionIndex].scrollIntoView({ block: 'nearest' });
                }
            };

            // Detener el carrusel al hacer click o enfocar el buscador
            heroSearchInput.addEventListener('focus', () => {
                stopAutoPlay();
                if (heroSearchInput.value.trim().length > 0) {
                    renderSuggestions(heroSearchInput.value);
                }
            });

            heroSearchInput.addEventListener('click', () => {
                stopAutoPlay();
            });

            heroSearchInput.addEventListener('input', event => {
                stopAutoPlay();
                renderSuggestions(event.target.value);
            });

            // Navegación con teclado dentro de las sugerencias
            heroSearchInput.addEventListener('keydown', event => {
                const items = heroSearchDropdown.querySelectorAll('.hero-search-item');

                if (event.key === 'ArrowDown' && items.length > 0) {
                    event.preventDefault();
                    activeSuggestionIndex = (activeSuggestionIndex + 1) % items.length;
                    updateActiveOption(items);
                } else if (event.key === 'ArrowUp' && items.length > 0) {
                    event.preventDefault();
                    activeSuggestionIndex = (activeSuggestionIndex - 1 + items.length) % items.length;
                    updateActiveOption(items);
                } else if (event.key === 'Escape') {
                    closeSuggestions();
                }
            });

            // Al enviar el formulario, redirigir a la sugerencia seleccionada o a la primera coincidencia
            heroSearchForm.addEventListener('submit', event => {
                event.preventDefault();
                stopAutoPlay();

                const items = heroSearchDropdown.querySelectorAll('.hero-search-item');
                if (activeSuggestionIndex >= 0 && items[activeSuggestionIndex]) {
                    window.location.href = items[activeSuggestionIndex].getAttribute('href');
                } else if (currentMatches.length > 0) {
                    window.location.href = currentMatches[0].url;
                } else {
                    renderSuggestions(heroSearchInput.value);
                }
            });

            // Cerrar sugerencias y reanudar carrusel al hacer click fuera del buscador
            document.addEventListener('click', event => {
                if (!heroSearchForm.contains(event.target)) {
                    closeSuggestions();
                    if (document.activeElement !== heroSearchInput && heroSearchInput.value.trim() === '') {
                        resumeAutoPlay();
                    }
                }
            });
        }
/* =========================================
============================================
============================================
============================================

        TERMINO DE EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */
    }
    
    /* =========================================
       NOTICIAS COMPARTIDAS
    ========================================= */

    const noticiasMunicipales = Array.isArray(window.noticiasMunicipales) ? window.noticiasMunicipales : [];

    /* -----------------------------------------
       Crear tarjeta normal
    ----------------------------------------- */

    const createNewsCard = noticia => {

        const newsLink = noticia.enlace
            ? `
                <a
                    href="${noticia.enlace}"
                    class="home-news-link">
                    Leer más →
                </a>
            `
            : '';

        return `
            <article class="news-card">

                <img
                    src="${noticia.imagen}"
                    alt="${noticia.alt}"
                    class="news-img">

                <div class="news-content">

                    <span class="news-kicker">
                        ${noticia.categoria} - ${noticia.fecha}
                    </span>

                    <h3 class="news-title-small">
                        ${noticia.titulo}
                    </h3>

                    <p class="news-excerpt-small">
                        ${noticia.resumen}
                    </p>

                    ${newsLink}

                </div>

            </article>
        `;

    };

    /* -----------------------------------------
       Crear noticia destacada
    ----------------------------------------- */

    const createFeaturedNews = noticia => {

        const featuredLink = noticia.enlace
            ? `
                <a
                    href="${noticia.enlace}"
                    class="btn btn-primary">
                    Leer noticia completa
                </a>
            `
            : '';

        return `
            <article class="news-card featured-news">

                <img
                    src="${noticia.imagen}"
                    alt="${noticia.alt}"
                    class="news-img">

                <div class="news-content">

                    <span class="news-kicker">
                        ${noticia.categoria} - ${noticia.fecha}
                    </span>

                    <h2 class="news-title">
                        ${noticia.titulo}
                    </h2>

                    <p class="news-excerpt">
                        ${noticia.resumen}
                    </p>

                    ${featuredLink}

                </div>

            </article>
        `;

    };

    /* -----------------------------------------
       INDEX - Mostrar últimas 3
    ----------------------------------------- */

    const homeNewsGrid = document.getElementById('home-news-grid');

    if (homeNewsGrid && noticiasMunicipales.length > 0) {

        const ultimasNoticias = noticiasMunicipales.slice(0, 3);

        homeNewsGrid.innerHTML = ultimasNoticias
            .map(createNewsCard)
            .join('');
    }

    /* -----------------------------------------
       NOTICIAS.HTML - Noticia destacada
    ----------------------------------------- */

    const featuredNewsContainer = document.getElementById('featured-news-container');

    if (featuredNewsContainer && noticiasMunicipales.length > 0) {
        featuredNewsContainer.innerHTML = createFeaturedNews(noticiasMunicipales[0]);
    }

    /* -----------------------------------------
       NOTICIAS.HTML - Noticias restantes
    ----------------------------------------- */

    const newsGrid = document.getElementById('news-grid');

    if (newsGrid && noticiasMunicipales.length > 1) {
        newsGrid.innerHTML = noticiasMunicipales
            .slice(1)
            .map(createNewsCard)
            .join('');
    }

    /* -----------------------------------------
    NOTICIAS.HTML - Resumen principal
    ----------------------------------------- */

    const resumenNoticiasGrid = document.getElementById('resumen-noticias-grid');

    if (resumenNoticiasGrid && noticiasMunicipales.length > 0) {
        resumenNoticiasGrid.innerHTML = noticiasMunicipales
            .slice(0, 3)
            .map(createNewsCard)
            .join('');
    }

    /* =========================================
    FILTROS - NOTICIAS
    ========================================= */

    const newsFilterButtons = document.querySelectorAll('[data-news-filter]');

    if (newsFilterButtons.length > 0 && newsGrid) {

        newsFilterButtons.forEach(button => {

            button.addEventListener('click', () => {

                const selectedFilter = button.dataset.newsFilter;

                /* Estado de botones */
                newsFilterButtons.forEach(filterButton => {filterButton.classList.remove('active');});

                button.classList.add('active');

                /* Mostrar u ocultar destacada */
                if (featuredNewsContainer) {
                    featuredNewsContainer.hidden = selectedFilter !== 'all';
                }

                /* Elegir noticias */
                const filteredNews = selectedFilter === 'all'
                    ? noticiasMunicipales.slice(1)
                    : noticiasMunicipales.filter(
                        noticia => noticia.filtro === selectedFilter
                    );

                /* Render */
                if (filteredNews.length > 0) {

                    newsGrid.innerHTML = filteredNews
                        .map(createNewsCard)
                        .join('');
                } else {
                    newsGrid.innerHTML = `
                        <p class="news-empty">
                            No hay noticias disponibles
                            en esta categoría.
                        </p>
                    `;
                }

            });

        });

    }

    /* =========================================
       FILTROS - CONCURSOS PÚBLICOS
    ========================================= */

    const concursoFilters = document.querySelectorAll('.concursos-filter');
    const concursoCards = document.querySelectorAll('.concurso-card');
    const concursosEmpty = document.getElementById('concursos-empty');

    if (concursoFilters.length > 0 && concursoCards.length > 0) {

        concursoFilters.forEach(filterButton => {

            filterButton.addEventListener('click', () => {

                const selectedFilter = filterButton.dataset.filter;

                /* Actualizar botón activo */
                concursoFilters.forEach(button => {

                    button.classList.remove('active');

                });


                filterButton.classList.add('active');

                /* Filtrar tarjetas */
                let visibleCards = 0;

                concursoCards.forEach(card => {

                    const cardStatus = card.dataset.status;

                    const shouldShow = selectedFilter === 'all' || cardStatus === selectedFilter;

                    card.hidden = !shouldShow;

                    if (shouldShow){visibleCards++;}

                });


                /* Mostrar mensaje si no hay resultados */
                if (concursosEmpty) {
                    concursosEmpty.hidden = visibleCards !== 0;
                }

            });

        });

    }

    /* =========================================
       PORTAL DE PAGOS
    ========================================= */

    const paymentServiceButtons = document.querySelectorAll('.payment-service-card');
    const paymentWorkspaceKicker = document.getElementById('payment-workspace-kicker');
    const paymentWorkspaceTitle = document.getElementById('payment-workspace-title');
    const paymentWorkspaceDescription = document.getElementById('payment-workspace-description');
    const paymentRequirementsList = document.getElementById('payment-requirements-list');
    const paymentFormTitle = document.getElementById('payment-form-title');
    const paymentDynamicFields = document.getElementById('payment-dynamic-fields');
    const paymentQueryForm = document.getElementById('payment-query-form');
    const paymentFormStatus = document.getElementById('payment-form-status');

    /* =========================================
       CONFIGURACIÓN DE SERVICIOS
    ========================================= */

    const paymentServices = {


        circulacion: {

            kicker: 'VEHÍCULOS',

            title: 'Permiso de circulación',

            description:
                'Consulta información asociada al permiso de circulación de un vehículo.',

            formTitle:
                'Consultar permiso',

            requirements: [
                'Ten a mano la patente del vehículo.',
                'Ingresa los datos solicitados para realizar la consulta.'
            ],

            fields: [

                {
                    id: 'payment-plate',
                    label: 'Patente del vehículo',
                    type: 'text',
                    placeholder: 'ABCD12',
                    required: true
                },

                {
                    id: 'payment-rut',
                    label: 'RUT del propietario',
                    type: 'text',
                    placeholder: '12.345.678-9',
                    required: true
                }

            ]

        },


        patentes: {

            kicker: 'COMERCIO',

            title: 'Patentes comerciales',

            description:
                'Consulta información relacionada con una patente comercial municipal.',

            formTitle:
                'Consultar patente',

            requirements: [
                'Identifica al titular o contribuyente.',
                'Si dispones del número o rol de patente, tenlo a mano.'
            ],

            fields: [

                {
                    id: 'payment-commerce-rut',
                    label: 'RUT del contribuyente',
                    type: 'text',
                    placeholder: '12.345.678-9',
                    required: true
                },

                {
                    id: 'payment-commerce-role',
                    label: 'Número o rol de patente',
                    type: 'text',
                    placeholder: 'Ej: 001234',
                    required: false
                }

            ]

        },


        aseo: {

            kicker: 'PROPIEDADES',

            title: 'Aseo domiciliario',

            description:
                'Consulta información asociada a derechos municipales de aseo domiciliario.',

            formTitle:
                'Consultar derechos de aseo',

            requirements: [
                'Identifica la propiedad asociada.',
                'Ten disponible el RUT del contribuyente.'
            ],

            fields: [

                {
                    id: 'payment-cleaning-role',
                    label: 'Rol de la propiedad',
                    type: 'text',
                    placeholder: 'Ej: 123-45',
                    required: true
                },

                {
                    id: 'payment-cleaning-rut',
                    label: 'RUT del contribuyente',
                    type: 'text',
                    placeholder: '12.345.678-9',
                    required: true
                }

            ]

        },


        multas: {

            kicker: 'INFRACCIONES',

            title: 'Pago de multas',

            description:
                'Consulta partes empadronados asociados a un vehículo.',

            formTitle:
                'Consultar multas',

            requirements: [
                'Ingresa la patente del vehículo.',
                'Revisa los antecedentes antes de continuar con un pago.'
            ],

            fields: [

                {
                    id: 'payment-fine-plate',
                    label: 'Patente del vehículo',
                    type: 'text',
                    placeholder: 'ABCD12',
                    required: true
                }

            ]

        },


        derechos: {

            kicker: 'OTROS PAGOS',

            title: 'Derechos municipales',

            description:
                'Consulta órdenes de ingreso, derechos y otros pagos municipales.',

            formTitle:
                'Consultar derecho municipal',

            requirements: [
                'Ten disponible el RUT asociado a la gestión.',
                'Si cuentas con un folio u orden de ingreso, ingrésalo.'
            ],

            fields: [

                {
                    id: 'payment-rights-rut',
                    label: 'RUT',
                    type: 'text',
                    placeholder: '12.345.678-9',
                    required: true
                },

                {
                    id: 'payment-rights-folio',
                    label: 'Folio u orden de ingreso',
                    type: 'text',
                    placeholder: 'Ej: 000123',
                    required: false
                }

            ]

        },


        convenios: {

            kicker: 'CONVENIOS',

            title: 'Convenios municipales',

            description:
                'Consulta información relacionada con convenios de pago municipales.',

            formTitle:
                'Consultar convenio',

            requirements: [
                'Identifica al titular del convenio.',
                'Si cuentas con un número de convenio, puedes ingresarlo.'
            ],

            fields: [

                {
                    id: 'payment-agreement-rut',
                    label: 'RUT del titular',
                    type: 'text',
                    placeholder: '12.345.678-9',
                    required: true
                },

                {
                    id: 'payment-agreement-number',
                    label: 'Número de convenio',
                    type: 'text',
                    placeholder: 'Ej: 001234',
                    required: false
                }

            ]

        },


        causas: {

            kicker: 'JUZGADO',

            title: 'Consultar causas',

            description:
                'Consulta antecedentes referenciales asociados a causas del Juzgado de Policía Local.',

            formTitle:
                'Consultar causa',

            requirements: [
                'Ten disponible el número de causa o rol si lo conoces.',
                'Puedes complementar la búsqueda con el RUT correspondiente.'
            ],

            fields: [

                {
                    id: 'payment-case-number',
                    label: 'Número de causa o rol',
                    type: 'text',
                    placeholder: 'Ej: 12345-2026',
                    required: true
                },

                {
                    id: 'payment-case-rut',
                    label: 'RUT',
                    type: 'text',
                    placeholder: '12.345.678-9',
                    required: false
                }

            ]

        }

    };

    /* =========================================
       CREAR CAMPOS DEL FORMULARIO
    ========================================= */

    const renderPaymentFields = fields => {

        if (!paymentDynamicFields) return;


        paymentDynamicFields.innerHTML = fields
            .map(field => {

                return `
                    <div class="payment-field">

                        <label for="${field.id}">
                            ${field.label}
                        </label>

                        <input
                            type="${field.type}"
                            id="${field.id}"
                            name="${field.id}"
                            placeholder="${field.placeholder}"
                            ${field.required ? 'required' : ''}>

                    </div>
                `;

            })
            .join('');

    };

    /* =========================================
       CAMBIAR SERVICIO
    ========================================= */

    const selectPaymentService = serviceKey => {

        const service = paymentServices[serviceKey];

        if (!service) return;

        paymentWorkspaceKicker.textContent = service.kicker;
        paymentWorkspaceTitle.textContent = service.title;
        paymentWorkspaceDescription.textContent = service.description;
        paymentFormTitle.textContent = service.formTitle;

        paymentRequirementsList.innerHTML = service.requirements
            .map(item => `<li>${item}</li>`)
            .join('');

        renderPaymentFields(service.fields);

        if (paymentFormStatus) {
            paymentFormStatus.textContent = '';
        }

        paymentServiceButtons.forEach(button => {

            const isActive = button.dataset.paymentService === serviceKey;

            button.classList.toggle(
                'active',
                isActive
            );

            button.setAttribute(
                'aria-pressed',
                String(isActive)
            );

        });

    };

    /* =========================================
       EVENTOS DE TARJETAS
    ========================================= */

    if (paymentServiceButtons.length > 0 && paymentDynamicFields) {

        /* Servicio inicial */
        selectPaymentService('circulacion');

        paymentServiceButtons.forEach(button => {

            button.addEventListener('click', () => {

                const serviceKey = button.dataset.paymentService;

                selectPaymentService(serviceKey);

            });

        });

    }

    /* =========================================
       CONSULTA DEMOSTRATIVA
    ========================================= */

    if (paymentQueryForm && paymentFormStatus) {

        paymentQueryForm.addEventListener(
            'submit',
            event => {

                event.preventDefault();

                paymentFormStatus.textContent =
                    'Consulta demostrativa: en una implementación real, aquí aparecerían las obligaciones asociadas y la opción de continuar al pago.';

            }
        );

    }

    /* =========================================
       HERRAMIENTAS DE ACCESIBILIDAD
    ========================================= */

    const accessibilityWidget = document.querySelector('.accessibility-widget');

    const accessibilityToggle = document.getElementById('accessibility-toggle');
    const accessibilityPanel = document.getElementById('accessibility-panel');
    const accessibilityClose = document.getElementById('accessibility-close');

    const fontDecrease = document.getElementById('font-decrease');
    const fontReset = document.getElementById('font-reset');
    const fontIncrease = document.getElementById('font-increase');

    const contrastToggle = document.getElementById('contrast-toggle');
    const linksToggle = document.getElementById('links-toggle');

    const accessibilityReset = document.getElementById('accessibility-reset');

    /* -----------------------------------------
       Preferencias guardadas
    ----------------------------------------- */

/* =========================================
============================================
============================================
============================================

            EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */
    // 5 niveles de tamaño de fuente: 2 de achicar (84%, 92%), por defecto (100%), y 2 de agrandar (108%, 116%)
    const FONT_SCALE_STEPS = [84, 92, 100, 108, 116];

    const getClosestFontScale = value => {
        const num = Number(value);
        if (!num) return 100;
        return FONT_SCALE_STEPS.reduce((prev, curr) =>
            Math.abs(curr - num) < Math.abs(prev - num) ? curr : prev
        );
    };

    let fontScale = getClosestFontScale(localStorage.getItem('elmonte-font-scale'));
/* =========================================
============================================
============================================
============================================

        TERMINO DE EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */

    let highContrast = localStorage.getItem('elmonte-high-contrast') === 'true';

    let underlineLinks = localStorage.getItem('elmonte-underline-links') === 'true';

    /* -----------------------------------------
       Aplicar ajustes
    ----------------------------------------- */

    const applyAccessibilitySettings = () => {

        document.documentElement.style.fontSize = `${fontScale}%`;

/* =========================================
============================================
============================================
============================================

            EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */
        const stepIndex = FONT_SCALE_STEPS.indexOf(fontScale);

        if (fontDecrease && fontReset && fontIncrease) {
            fontDecrease.classList.toggle('is-active', fontScale < 100);
            fontReset.classList.toggle('is-active', fontScale === 100);
            fontIncrease.classList.toggle('is-active', fontScale > 100);

            fontDecrease.disabled = stepIndex <= 0;
            fontIncrease.disabled = stepIndex >= FONT_SCALE_STEPS.length - 1;
        }

        const controlLabel = accessibilityWidget?.querySelector('.accessibility-control-label');
        if (controlLabel) {
            let badge = controlLabel.querySelector('.accessibility-scale-badge');
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'accessibility-scale-badge';
                controlLabel.appendChild(badge);
            }
            const stepLabels = {
                84: '−2',
                92: '−1',
                100: 'Normal',
                108: '+1',
                116: '+2'
            };
            badge.textContent = stepLabels[fontScale] || 'Normal';
        }
/* =========================================
============================================
============================================
============================================

        TERMINO DE EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */

        document.body.classList.toggle(
            'accessibility-contrast',
            highContrast
        );

        document.body.classList.toggle(
            'accessibility-underline-links',
            underlineLinks
        );

        contrastToggle.setAttribute(
            'aria-pressed',
            String(highContrast)
        );

        linksToggle.setAttribute(
            'aria-pressed',
            String(underlineLinks)
        );

        contrastToggle.classList.toggle(
            'is-active',
            highContrast
        );

        linksToggle.classList.toggle(
            'is-active',
            underlineLinks
        );
    };

    /* -----------------------------------------
       Guardar preferencias
    ----------------------------------------- */

    const saveAccessibilitySettings = () => {

        localStorage.setItem(
            'elmonte-font-scale',
            fontScale
        );

        localStorage.setItem(
            'elmonte-high-contrast',
            highContrast
        );

        localStorage.setItem(
            'elmonte-underline-links',
            underlineLinks
        );
    };

    /* -----------------------------------------
       Abrir / cerrar panel
    ----------------------------------------- */

    const openAccessibilityPanel = () => {

        accessibilityPanel.hidden = false;

        accessibilityToggle.setAttribute(
            'aria-expanded',
            'true'
        );

        accessibilityToggle.setAttribute(
            'aria-label',
            'Cerrar herramientas de accesibilidad'
        );
    };

    const closeAccessibilityPanel = () => {

        accessibilityPanel.hidden = true;

        accessibilityToggle.setAttribute(
            'aria-expanded',
            'false'
        );

        accessibilityToggle.setAttribute(
            'aria-label',
            'Abrir herramientas de accesibilidad'
        );
    };

    accessibilityToggle.addEventListener('click', () => {

        if (accessibilityPanel.hidden) {
            openAccessibilityPanel();
        } else {
            closeAccessibilityPanel();
        }

    });

    accessibilityClose.addEventListener('click', () => {

        closeAccessibilityPanel();
        accessibilityToggle.focus();

    });

    /* -----------------------------------------
       Tamaño de texto
    ----------------------------------------- */

/* =========================================
============================================
============================================
============================================

            EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */
    fontDecrease.addEventListener('click', () => {

        const currentIndex = FONT_SCALE_STEPS.indexOf(fontScale);
        if (currentIndex > 0) {
            fontScale = FONT_SCALE_STEPS[currentIndex - 1];
        }

        applyAccessibilitySettings();
        saveAccessibilitySettings();

    });

    fontReset.addEventListener('click', () => {

        fontScale = 100;

        applyAccessibilitySettings();
        saveAccessibilitySettings();

    });

    fontIncrease.addEventListener('click', () => {

        const currentIndex = FONT_SCALE_STEPS.indexOf(fontScale);
        if (currentIndex < FONT_SCALE_STEPS.length - 1) {
            fontScale = FONT_SCALE_STEPS[currentIndex + 1];
        }

        applyAccessibilitySettings();
        saveAccessibilitySettings();

    });
/* =========================================
============================================
============================================
============================================

        TERMINO DE EDICIÓN NUEVA - CIAN

============================================
============================================
============================================
   ========================================= */

    /* -----------------------------------------
       Alto contraste
    ----------------------------------------- */

    contrastToggle.addEventListener('click', () => {

        highContrast = !highContrast;

        applyAccessibilitySettings();
        saveAccessibilitySettings();

    });

    /* -----------------------------------------
       Subrayar enlaces
    ----------------------------------------- */

    linksToggle.addEventListener('click', () => {

        underlineLinks = !underlineLinks;

        applyAccessibilitySettings();
        saveAccessibilitySettings();

    });

    /* -----------------------------------------
       Restablecer todos los ajustes
    ----------------------------------------- */

    accessibilityReset.addEventListener('click', () => {

        fontScale = 100;
        highContrast = false;
        underlineLinks = false;

        applyAccessibilitySettings();
        saveAccessibilitySettings();

    });

    /* -----------------------------------------
       Cerrar con ESC
    ----------------------------------------- */

    document.addEventListener('keydown', event => {

        if (
            event.key === 'Escape' &&
            !accessibilityPanel.hidden
        ) {

            closeAccessibilityPanel();
            accessibilityToggle.focus();

        }

    });

    /* -----------------------------------------
       Cerrar al hacer clic fuera
    ----------------------------------------- */

    document.addEventListener('click', event => {

        if (
            !accessibilityPanel.hidden &&
            !accessibilityWidget.contains(event.target)
        ) {

            closeAccessibilityPanel();

        }

    });

    /* -----------------------------------------
       Aplicar preferencias al cargar
    ----------------------------------------- */

    applyAccessibilitySettings();


    /* =========================================
       MUNICIPALIDAD - GALERÍA ARCHIVO HISTÓRICO
    ========================================= */

    const historyGallery = document.querySelector('[data-history-gallery]');

    if (historyGallery) {

        const historyImage = historyGallery.querySelector('[data-history-image]');
        const historyPrev = historyGallery.querySelector('[data-history-prev]');
        const historyNext = historyGallery.querySelector('[data-history-next]');
        const historyCurrent = historyGallery.querySelector('[data-history-current]');
        const historyTotal = historyGallery.querySelector('[data-history-total]');
        const historyProgress = historyGallery.querySelector('[data-history-progress]');
        const historyStatus = historyGallery.querySelector('[data-history-status]');

        const historyBase = historyGallery.dataset.historyBase || '';
        const historyCount = Number(historyGallery.dataset.historyCount) || 19;

        const historyExtensions = [
            '.jpeg',
            '.jpg',
            '.png',
            '.webp',
            '.JPEG',
            '.JPG',
            '.PNG',
            '.WEBP'
        ];

        const reducedMotionQuery =
            window.matchMedia('(prefers-reduced-motion: reduce)');

        let historyIndex = 0;
        let historyTimer = null;
        let historyRequestToken = 0;
        let historyPaused = false;

        const historyPad = value =>
            String(value).padStart(2, '0');

        const stopHistoryAutoplay = () => {
            if (historyTimer) {
                clearInterval(historyTimer);
                historyTimer = null;
            }
        };

        const startHistoryAutoplay = () => {

            stopHistoryAutoplay();

            if (
                reducedMotionQuery.matches ||
                historyPaused ||
                document.hidden
            ) {
                return;
            }

            historyTimer = setInterval(() => {
                showHistoryImage(historyIndex + 1, false);
            }, 5200);

        };

        const tryHistorySource = (
            baseName,
            extensionIndex,
            token,
            onSuccess,
            onFailure
        ) => {

            if (extensionIndex >= historyExtensions.length) {
                onFailure();
                return;
            }

            const candidate =
                `${baseName}${historyExtensions[extensionIndex]}`;

            const preload = new Image();

            preload.onload = () => {

                if (token !== historyRequestToken) return;

                onSuccess(candidate);

            };

            preload.onerror = () => {

                if (token !== historyRequestToken) return;

                tryHistorySource(
                    baseName,
                    extensionIndex + 1,
                    token,
                    onSuccess,
                    onFailure
                );

            };

            preload.src = candidate;

        };

        const updateHistoryInterface = (
            resolvedIndex,
            source,
            announce
        ) => {

            if (!historyImage) return;

            historyImage.classList.add('is-changing');

            window.setTimeout(() => {

                historyImage.src = source;

                historyImage.alt =
                    `Registro del Archivo Histórico de El Monte, imagen ${resolvedIndex + 1} de ${historyCount}`;

                historyImage.classList.remove('is-changing');

            }, 120);

            if (historyCurrent) {
                historyCurrent.textContent =
                    historyPad(resolvedIndex + 1);
            }

            if (historyTotal) {
                historyTotal.textContent =
                    historyPad(historyCount);
            }

            if (historyProgress) {
                historyProgress.style.width =
                    `${((resolvedIndex + 1) / historyCount) * 100}%`;
            }

            if (historyStatus && announce) {
                historyStatus.textContent =
                    `Mostrando registro ${resolvedIndex + 1} de ${historyCount}.`;
            }

        };

        const showHistoryImage = (
            requestedIndex,
            announce = false
        ) => {

            const normalizedIndex =
                (requestedIndex + historyCount) % historyCount;

            const token = ++historyRequestToken;

            const baseName =
                `${historyBase}${historyPad(normalizedIndex + 1)}`;

            tryHistorySource(
                baseName,
                0,
                token,
                source => {

                    historyIndex = normalizedIndex;

                    updateHistoryInterface(
                        historyIndex,
                        source,
                        announce
                    );

                    startHistoryAutoplay();

                },
                () => {

                    if (historyStatus) {
                        historyStatus.textContent =
                            `No fue posible cargar el registro ${normalizedIndex + 1}.`;
                    }

                    stopHistoryAutoplay();

                }
            );

        };

        if (historyPrev) {
            historyPrev.addEventListener('click', () => {
                showHistoryImage(historyIndex - 1, true);
            });
        }

        if (historyNext) {
            historyNext.addEventListener('click', () => {
                showHistoryImage(historyIndex + 1, true);
            });
        }

        historyGallery.addEventListener('mouseenter', () => {
            historyPaused = true;
            stopHistoryAutoplay();
        });

        historyGallery.addEventListener('mouseleave', () => {
            historyPaused = false;
            startHistoryAutoplay();
        });

        historyGallery.addEventListener('focusin', () => {
            historyPaused = true;
            stopHistoryAutoplay();
        });

        historyGallery.addEventListener('focusout', event => {

            if (
                event.relatedTarget &&
                historyGallery.contains(event.relatedTarget)
            ) {
                return;
            }

            historyPaused = false;
            startHistoryAutoplay();

        });

        document.addEventListener('visibilitychange', () => {

            if (document.hidden) {
                stopHistoryAutoplay();
            } else {
                startHistoryAutoplay();
            }

        });

        reducedMotionQuery.addEventListener?.(
            'change',
            startHistoryAutoplay
        );

        showHistoryImage(0, false);

    }


    /* =========================================
       FORMULARIOS DE CONTACTO - OFICINA DE PARTES
    ========================================= */

    const municipalContactEmail = 'partes@munielmonte.cl';

    document
        .querySelectorAll('.contact-form[data-contact-form]')
        .forEach(form => {

            const status = form.querySelector('.contact-form-status');

            form.addEventListener('submit', event => {

                event.preventDefault();

                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                const data = new FormData(form);

                const nombre = String(data.get('nombre') || '').trim();
                const email = String(data.get('email') || '').trim();
                const telefono = String(data.get('telefono') || '').trim();
                const mensaje = String(data.get('mensaje') || '').trim();

                const subject =
                    `Consulta web municipal - ${nombre || 'Vecino/a'}`;

                const bodyLines = [
                    `Nombre: ${nombre}`,
                    `Correo electrónico: ${email}`,
                    telefono ? `Teléfono: ${telefono}` : null,
                    `Página de origen: ${document.title}`,
                    '',
                    'Mensaje:',
                    mensaje
                ].filter(line => line !== null);

                const mailtoUrl =
                    `mailto:${municipalContactEmail}` +
                    `?subject=${encodeURIComponent(subject)}` +
                    `&body=${encodeURIComponent(bodyLines.join('\n'))}`;

                if (status) {
                    status.textContent =
                        'Se preparó tu consulta. Revisa el mensaje y presiona Enviar en tu aplicación de correo.';
                }

                window.location.href = mailtoUrl;

            });

        });

    /* =========================================
       ACCESO FUNCIONARIOS
    ========================================= */

    const employeeLoginForm = document.getElementById('employee-login-form');

    const employeeLoginStatus = document.getElementById('employee-login-status');

    if (employeeLoginForm && employeeLoginStatus) {

        employeeLoginForm.addEventListener('submit', event => {

            event.preventDefault();

            employeeLoginStatus.textContent =
                'Acceso de demostración. La conexión con la intranet municipal aún no está habilitada.';

        });

    }

    /* =========================================
    SISTEMA DE PANELES - NOTICIAS
    ========================================= */

    const newsPanels = document.querySelectorAll('.news-panel');

    const getNewsPanelFromLocation = () => {

        /* Si existe un hash interno, tiene prioridad */
        const hashPanel = window.location.hash.substring(1);

        if (hashPanel) {return hashPanel;}

        /* Panel solicitado desde otra página */
        const params = new URLSearchParams(window.location.search);

        const queryPanel = params.get('panel');

        if (queryPanel) {
            return queryPanel.startsWith('panel-')
                ? queryPanel
                : `panel-${queryPanel}`;
        }

        return 'panel-resumen';

    };

    const showNewsPanel = panelId => {

        if (newsPanels.length === 0) return;

        /* Ocultar todos */
        newsPanels.forEach(panel => {panel.classList.remove('active');});

        /* Mostrar panel solicitado */
        const activePanel =
            document.getElementById(panelId) ||
            document.getElementById('panel-resumen');

        if (!activePanel) return;

        activePanel.classList.add('active');

        /* Estado activo del menú Noticias */
        const newsNavLinks = document.querySelectorAll('.nav-noticias-link');

        newsNavLinks.forEach(link => {link.classList.remove('active');});

        const currentId = activePanel.id;

        const panelKey = currentId.replace('panel-', '');

        const activeHref =
            currentId === 'panel-resumen'
                ? 'noticias.html'
                : `noticias.html?panel=${panelKey}`;

        const activeLink = document.querySelector(`.nav-noticias-link[href="${activeHref}"]`);

        if (activeLink) {
            activeLink.classList.add('active');
            const newsMenu = activeLink.closest('.nav-item-has-submenu');
            const parentLink = newsMenu?.querySelector(':scope > a.nav-noticias-link');
            if (parentLink) {parentLink.classList.add('active');}
        }
    };

    /* Cambios internos mediante hash */
    window.addEventListener('hashchange', () => {
        if (newsPanels.length === 0) return;
        showNewsPanel(getNewsPanelFromLocation());
    });


    /* Vista inicial */
    if (newsPanels.length > 0) {
        showNewsPanel(getNewsPanelFromLocation());
    }

    /* =========================================
    SISTEMA DE PANELES - CONTACTOS
    ========================================= */

    const contactPanels = document.querySelectorAll('.contact-panel');

    const showContactPanel = panelId => {

        if (contactPanels.length === 0) return;
        contactPanels.forEach(panel => {panel.classList.remove('active');});

        const activePanel = document.getElementById(panelId) || document.getElementById('panel-contacto');
        if (!activePanel) return;

        activePanel.classList.add('active');

    };

    /* Cambio mediante hash */
    window.addEventListener('hashchange', () => {

        if (contactPanels.length === 0) return;

        const hash = window.location.hash.substring(1) || 'panel-contacto';
        showContactPanel(hash);

    });

    /* Vista inicial */
    if (contactPanels.length > 0) {

        const initialHash = window.location.hash.substring(1) || 'panel-contacto';
        showContactPanel(initialHash);

    }

    /* =========================================
    BUSCADOR - AGENDA TELEFÓNICA
    ========================================= */

    const contactSearch = document.getElementById('search-contact');

    const directoryCards = document.querySelectorAll('.directory-card');

    if (contactSearch && directoryCards.length > 0) {

        contactSearch.addEventListener('input', event => {

            const searchTerm = event.target.value
                .trim()
                .toLowerCase();

            directoryCards.forEach(card => {

                const contactItems = card.querySelectorAll('.contact-item');
                let visibleItems = 0;

                contactItems.forEach(item => {

                    const matches = item.textContent
                        .toLowerCase()
                        .includes(searchTerm);


                    item.hidden = !matches;

                    if (matches) {visibleItems++;}

                });


                card.hidden = visibleItems === 0;

            });
        });
    }

});