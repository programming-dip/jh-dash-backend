/**
 * Main Application Class
 * Handles core application functionality and initialization
 */

class App {
    /**
     * Initialize the application
     * */ 

    constructor() {
        // Get the html doc
        this.html = document.getElementsByTagName("html")[0];

        // Initialize configuration objects
        this.config = {};
        this.defaultConfig = window.config;
    }

    /**
     * Initialize UI components
     * Sets up Waves effect for buttons and other interactive elements
     */
    initComponents() {
        Waves.init();
    }

    /**
     * Initialize the sidebar navigation
     * Handles active states and scrolling to active menu items
     */
    initSidenav(){
       // Get current page URL without query parameters
       var currentUrl = window.location.href.split(/[?#]/)[0];
       
       // Set active state for current menu item
       document.querySelectorAll("ul.admin-menu .menu-item a").forEach(menuItem => {
        if(menuItem.href === currentUrl){
            // Add active class to current menu item
            menuItem.classList.add("active");

            let menuItemElement = menuItem.closest(".menu-item");
            menuItemElement.classList.add("active");

            // Handle parent accordion if exists
            let parentAccordion = menuItemElement.parentElement.parentElement.parentElement.parentElement;

            if(parentAccordion && parentAccordion.classList.contains("menu-item")){
              const accordionToggle = parentAccordion.querySelector(".hs-accordion-toggle");
              if (accordionToggle) {
                // Open parent accordion
                accordionToggle.classList.add("open");
                parentAccordion.classList.add("active");
                
                // Show accordion content
                const accordionContent = accordionToggle.nextElementSibling;
                if (accordionContent) {
                    accordionContent.classList.remove("hidden");
                }
            }  
            }
        }
       });

        // Scroll to active menu item after a short delay
        setTimeout(function() {
            var startPosition,
                scrollElement,
                duration,
                targetPosition,
                startTime,
                currentTime,
                activeMenuItem = document.querySelector("ul.admin-menu .menu-item.active a.active");

            function smoothScroll() {
                currentTime = startTime += 20;
                targetPosition = targetPosition;
                var time = currentTime;
                var position = (time /= duration / 2) < 1
                    ? scrollDistance / 2 * time * time + startPosition
                    : -scrollDistance / 2 * (--time * (time - 2) - 1) + startPosition;
                scrollElement.scrollTop = position;
                if (currentTime < duration) {
                    setTimeout(smoothScroll, 20);
                }
            }

            if (activeMenuItem != null) {
                var menuWrapper = document.querySelector("#app-menu .simplebar-content-wrapper");
                var menuItemTop = activeMenuItem.offsetTop - 300;

                if (menuWrapper && menuItemTop > 100) {
                    duration = 600;
                    startPosition = (scrollElement = menuWrapper).scrollTop;
                    targetPosition = menuItemTop - startPosition;
                    startTime = 0;
                    smoothScroll();
                }
            }
        }, 200);
    }


     /**
     * Find parent element matching selector
     * @param {HTMLElement} element - Starting element
     * @param {string} selector - CSS selector to match
     * @returns {HTMLElement|null} - Matching parent element or null
     */
     reverseQuery(element, selector) {
        while (element) {
            if (element.parentElement && element.parentElement.querySelector(selector) === element) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    }

    /**
     * Initialize fullscreen toggle functionality
     */

    initfullScreenListener() {
        var fullscreenButton = document.querySelector('[data-toggle="fullscreen"]');
        
        if (fullscreenButton) {
            fullscreenButton.addEventListener("click", function(event) {
                event.preventDefault();
                
                // Toggle fullscreen class on body
                document.body.classList.toggle("group-fullscreen");

                // Handle fullscreen API
                if (document.fullscreenElement || 
                    document.mozFullScreenElement || 
                    document.webkitFullscreenElement) {
                    // Exit fullscreen
                    if (document.cancelFullScreen) {
                        document.cancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    }
                } else {
                    // Enter fullscreen
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen();
                    } else if (document.documentElement.mozRequestFullScreen) {
                        document.documentElement.mozRequestFullScreen();
                    } else if (document.documentElement.webkitRequestFullscreen) {
                        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    }
                }
            });
        }
    }

    /**
     * Initialize the application
     * Calls all necessary initialization methods
     */
    init() {
        this.initComponents();
        this.initSidenav();
        this.initfullScreenListener();
    }

}

// Create and initialize the application
(new App).init();