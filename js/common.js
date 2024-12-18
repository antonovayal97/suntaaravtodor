document.addEventListener("DOMContentLoaded",(event) => {
    const body = document.querySelector("body");
    const header = document.querySelector("header");
    function mobileMenu()
    {
        let isMenuOpened = false;
        let button = header.querySelector(".header__burger");
        button.addEventListener("click",() => {
            isMenuOpened = !isMenuOpened;
            header.classList.toggle("header--active");
            body.style.overflow = (isMenuOpened) ? "hidden" : null;
        })
    }
    function headerHide()
    {
        let lastScrollTop = 0;
        let scrollDelta = 10; // величина скролла для активации
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > lastScrollTop && Math.abs(scrollTop - lastScrollTop) > scrollDelta) {
                // Прокрутка вниз, скрываем хедер с учетом дельты
                header.style.top = '-100px';
            } else if (scrollTop < lastScrollTop) {
                // Прокрутка вверх, показываем хедер сразу
                header.style.top = '0';
            }
            lastScrollTop = scrollTop;
        });
    }
    function initSlides()
    {
        let lastNews = document.querySelector(".last-news");
        let sidebarNews = document.querySelector(".page-sidebar__news-swiper");
        let detailNews = document.querySelector(".detail-news__slides");
        if(lastNews != undefined)
        {
            let lastNewsSwiper = new Swiper('.last-news__cards-swiper', {
                enabled: true,
                slidesPerView: "auto",
                spaceBetween: 16,
                breakpoints: {
                    1200: {
                        enabled: false,
                        spaceBetween: 40
                    },
                    1024: {
                        enabled: false,
                        slidesPerView: "auto",
                        spaceBetween: 16
                    }
                }
              });
        }
        if(sidebarNews != undefined)
        {
            let sidebarNewsSwiper = new Swiper('.page-sidebar__news-swiper', {
                enabled: true,
                slidesPerView: "auto",
                spaceBetween: 16,
                breakpoints: {
                    1200: {
                        enabled: false,
                        spaceBetween: 32,
                        direction: "vertical",
                    },
                    1024: {
                        direction: "horizontal",
                        enabled: true,
                        slidesPerView: "auto",
                        spaceBetween: 16
                    }
                }
              });
        }
        if(detailNews != undefined )
        {
            let detailNewsSwiper = new Swiper('.detail-news__slides .swiper', {
                slidesPerView: "auto",
                spaceBetween: 16,
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                  }
              });
        }
    }
    function initImages()
    {
        var images = document.querySelectorAll("img[data-src]");
        let window_width = window.innerWidth;
        images.forEach((image) => {
            if(window_width > 1024)
            {
                image.src = image.dataset.src;
            }
            else if(window_width <= 1024 && window_width > 766 && image.dataset.tabletSrc)
            {
                image.src = image.dataset.tabletSrc;
            }
            else if(window_width <= 766 && image.dataset.mobileSrc)
            {
                image.src = image.dataset.mobileSrc;
            }
            else
            {
                image.src = image.dataset.src;
            }
        })
    }
    function initSelects()
    {
        customSelect('select');
    }
    function initModals()
    {
        const modals = new HystModal({
            linkAttributeName: "data-hystmodal",
            //settings (optional). see API
        });
    }
    function initFileInput()
    {
        // Получаем элементы
        const fileInputs = document.querySelectorAll('input[type="file"]');

        fileInputs.forEach((fi) => {
            const fileNameDisplay = document.querySelector('label[for="' + fi.id + '"] span');
            // Обработчик изменения
            fi.addEventListener('change', () => {
                const fileName = fi.files[0]?.name || 'Файл не выбран';
                fileNameDisplay.textContent = fileName;
            });
        })

        
    }
    function initMaps()
    {
        ymaps.ready(initYandexMap);
    }
    function initYandexMap() {
       // Создаём карту с минимальными элементами управления.
        var myMap = new ymaps.Map("map", {
            center: [62.15185684718649,117.62526187623983], // Координаты центра карты.
            zoom: 15, // Масштаб карты.
            controls: ['zoomControl'] // Только элемент управления масштабом.
        });

        // Убираем возможность изменения карты жестами (если нужно).
        //myMap.behaviors.disable(['drag', 'scrollZoom', 'multiTouch']);

        // Опционально: можно добавить метку, если потребуется.
        var myPlacemark = new ymaps.Placemark([62.15185684718649,117.62526187623983], {
            //balloonContent: 'Москва'
        });
        myMap.geoObjects.add(myPlacemark);
    }
    function init()
    {
        mobileMenu();
        headerHide();
        initSlides();
        initImages();
        initSelects();
        initModals();
        initFileInput();
        initMaps();
    }

    function onWindowResize()
    {
        initImages();
    }

    init();

    window.addEventListener("resize", onWindowResize);

});
function initAspectRatio() {
    let items = document.querySelectorAll("[data-aspect-ratio]");

    function evaluateExpression(expression) {
        try {
            return new Function(`return ${expression}`)(); // Вычисляем выражение
        } catch (error) {
            console.error(`Invalid aspect ratio expression: "${expression}"`, error);
            return NaN; // Возвращаем NaN, если выражение некорректно
        }
    }

    function updateAspectRatio() {
        let window_width = window.innerWidth;
        items.forEach((item) => {
            let aspectRatio;
            if(item.dataset.tabletAspectRatio && window_width <= 1024 && window_width > 766)
            {
                aspectRatio = evaluateExpression(item.dataset.tabletAspectRatio);
            }
            else if(item.dataset.mobileAspectRatio && window_width <= 766)
            {
                aspectRatio = evaluateExpression(item.dataset.mobileAspectRatio);
            }
            else
            {
                aspectRatio = evaluateExpression(item.dataset.aspectRatio);
            }

            if (isNaN(aspectRatio) || aspectRatio <= 0) {
                console.error(`Invalid aspect ratio: ${item.dataset.aspectRatio}`);
                return; // Пропускаем элемент с некорректным значением
            }

            let currentWidth = item.offsetWidth;
            let newHeight = currentWidth / aspectRatio;
            item.style.height = newHeight + "px";
        });
    }

    // Обновляем размеры при изменении размера окна
    window.addEventListener("resize", updateAspectRatio);

    // Также вызываем функцию один раз при инициализации
    updateAspectRatio();
}

initAspectRatio();
