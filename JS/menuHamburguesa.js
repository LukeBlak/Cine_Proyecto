// JavaScript para el menú hamburguesa responsive
document.addEventListener('DOMContentLoaded', function() {
    // Crear el botón hamburguesa si no existe
    const header = document.querySelector('header');
    const menu = document.querySelector('.menu');
    
    // Verificar si ya existe el botón
    if (!document.querySelector('.menu-toggle')) {
        // Crear el botón hamburguesa
        const menuToggle = document.createElement('button');
        menuToggle.className = 'menu-toggle';
        menuToggle.setAttribute('aria-label', 'Abrir menú');
        menuToggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Insertar el botón después del h1
        const h1 = header.querySelector('h1');
        h1.parentNode.insertBefore(menuToggle, h1.nextSibling);
    }
    
    // Crear overlay si no existe
    if (!document.querySelector('.menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }
    
    const menuToggle = document.querySelector('.menu-toggle');
    const menuOverlay = document.querySelector('.menu-overlay');
    const menuLinks = menu.querySelectorAll('a');
    
    // Función para abrir el menú
    function openMenu() {
        menu.classList.add('active');
        menuToggle.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuToggle.setAttribute('aria-label', 'Cerrar menú');
    }
    
    // Función para cerrar el menú
    function closeMenu() {
        menu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        menuToggle.setAttribute('aria-label', 'Abrir menú');
    }
    
    // Toggle del menú al hacer clic en el botón
    menuToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        if (menu.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });
    
    // Cerrar menú al hacer clic en el overlay
    menuOverlay.addEventListener('click', closeMenu);
    
    // Cerrar menú al hacer clic en un enlace
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Cerrar menú al presionar Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // Cerrar menú al cambiar el tamaño de la ventana a desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && menu.classList.contains('active')) {
            closeMenu();
        }
    });
});