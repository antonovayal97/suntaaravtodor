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
        if(!document.querySelector("#map"))
        {
            return;
        }
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

    function initMask()
    {
        var phones = document.querySelectorAll('input[name="phone"]');
        phones.forEach((phone) => {
            IMask(phone, {
                mask: [
                  {
                    mask: '+000 00 0000000',
                    startsWith: '998',
                    lazy: false,
                    country: 'Узбекистан'
                  },
                  {
                    mask: '+000-00-000-0000',
                    startsWith: '992',
                    lazy: false,
                    country: 'Таджикистан'
                  },
                  {
                    mask: '+000 (000) 000-000',
                    startsWith: '996',
                    lazy: false,
                    country: 'Кыргызстан'
                  },
                  {
                    mask: '+0 (000) 000-00-00',
                    startsWith: '7',
                    lazy: false,
                    country: 'Russia'
                  },
                  {
                    mask: '0000000000000',
                    startsWith: '',
                    country: 'Страна не определена'
                  }
                ],
                dispatch: (appended, dynamicMasked) => {
                  const number = (dynamicMasked.value + appended).replace(/\D/g,'');
              
                  return dynamicMasked.compiledMasks.find(m => number.indexOf(m.startsWith) === 0);
                }
              })
              //.on('accept', function() {
              //  document.getElementById('dispatch-value').innerHTML = dispatchMask.masked.currentMask.country;
              //});
        })
    }

    function initForms() {
        const allForms = document.querySelectorAll('form[data-form]');
        allForms.forEach((form) => {
            form.addEventListener('submit', function (event) {
                const inputs = form.querySelectorAll('input[required]'); // Все обязательные input
                let isValid = true;
                inputs.forEach((input) => {

                    const parent = input.closest('.input');


                    // Событие ввода
                    input.addEventListener('input', () => {
                        if (parent) {
                            if (input.checkValidity()) {
                                parent.classList.remove('error'); // Убираем класс ошибки
                            } else {
                                parent.classList.add('error'); // Добавляем класс ошибки
                            }
                        }
                    });


                    //const errorMessage = input.nextElementSibling;
    
                    // Сброс предыдущего состояния
                    parent.classList.remove('error');
    
                    // Проверяем валидность
                    if (input.type === 'file') {
                        // Проверка для файлового ввода
                        if (!input.files || input.files.length === 0) {
                            isValid = false;
                            parent.classList.add('error');
                        }
                    } else if (input.type === 'checkbox') {
                        if(!input.checked)
                        {
                            isValid = false;
                            parent.classList.add('error');
                        }
                    } else if (!input.checkValidity()) {
                        // Проверка для остальных типов
                        isValid = false;
                        parent.classList.add('error');
                    }
                });
    
                // Если форма невалидна, предотвращаем отправку
                if (!isValid) {
                    event.preventDefault();
                }
            });
        });
    }
    
    function initLangSelect() {
        var select = document.querySelector(".header__lang .lang");
        var outside = select.querySelector(".lang__country[tabindex]");
        var outsideFlag = outside.querySelector(".lang__country-flag img");
        var outsideName = outside.querySelector(".lang__country-name span");
        var insideCountries = select.querySelectorAll(".lang__inside-countries .lang__country");
        var outsideArrow = select.querySelector(".lang__outside-arrow .icon");
    
        // Открытие/закрытие выпадающего списка
        outside.addEventListener("click", (event) => {
            event.stopPropagation();
            select.classList.toggle("lang--active");
        });
    
        outsideArrow.addEventListener("click", (event) => {
            event.stopPropagation();
            select.classList.toggle("lang--active");
        });
    
        // Выбор внутреннего языка
        insideCountries.forEach((country) => {
            country.addEventListener("click", () => {
                // Получение данных выбранной внутренней страны
                var selectedFlag = country.querySelector(".lang__country-flag img").src;
                var selectedName = country.querySelector(".lang__country-name span").textContent;
                var selectedLang = country.getAttribute("data-ya-lang");
    
                // Получение данных внешней страны
                var outsideFlagSrc = outsideFlag.src;
                var outsideNameText = outsideName.textContent;
                var outsideLang = outside.getAttribute("data-ya-lang");
    
                // Обмен местами данных
                country.querySelector(".lang__country-flag img").src = outsideFlagSrc;
                country.querySelector(".lang__country-name span").textContent = outsideNameText;
                country.setAttribute("data-ya-lang", outsideLang);
    
                outsideFlag.src = selectedFlag;
                outsideName.textContent = selectedName;
                outside.setAttribute("data-ya-lang", selectedLang);
    
                // Закрытие выпадающего списка
                select.classList.remove("lang--active");
            });
        });
    
        // Закрытие списка при клике вне
        document.addEventListener("click", (event) => {
            if (!select.contains(event.target)) {
                select.classList.remove("lang--active");
            }
        });
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
        initMask();
        initForms();
        initLangSelect();
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
