Array.prototype.__proto__.findInstance = function(el) {
    let value = false;
    Array.prototype.forEach.call(this, (v, k) => {
       if (v === el) {
           value = k;
       }
    });
    return value
};

$(function () {

    const mobileBreakpoint = 640;

    const defaultSwiperOptions = {
        direction: 'horizontal',
        autoHeight: !0,
        loop: !1,
        centeredSlides: false,
        allowTouchMove: true,
        passiveListeners: false,
        simulateTouch: true,
        touchStartPreventDefault: false,
        followFinger: false,
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    };

    let mobileInit = false;

    // fix height swiper sliders
    const swiperFix = (els) => {
        let count = 1;
        let swiperIntervalId = setInterval(function () {
            Array.prototype.forEach.call(els, (v) => {
                if (v) v.update();
            });
            if (count >= 3) {
                clearInterval(swiperIntervalId);
            }
            count++;
        }, 500);
    };

    let Swipers = [];

    const onResizeFn = () => {
        if (window.innerWidth <= mobileBreakpoint && !mobileInit) {

            Array.prototype.forEach.call(desktopSwipers, v => {
               if (v) v.destroy();
            });
            desktopSwipers = [];

            let mobileSwipers = $('.swiper-container-init-mobile');

            $.each(mobileSwipers, (k,v) => {
                v = $(v);
                let pagination = v.closest('.section-content').find('.swiper-pagination');
                let type = v.attr('data-swiper-type') || null;
                let slidesPerGroup = 1;

                if (type === 'client') {
                    slidesPerGroup = 9;
                }

                let elsHide = null;
                let elsShow = null;

                let mobileSwiper = new Swiper(v, {
                    direction: 'horizontal',
                    autoHeight: !0,
                    loop: !1,
                    centeredSlides: true,
                    allowTouchMove: true,
                    passiveListeners: false,
                    simulateTouch: true,
                    touchStartPreventDefault: false,
                    followFinger: false,
                    slidesPerView: 1,
                    spaceBetween: 60,
                    slidesPerGroup: slidesPerGroup,
                    calculateHeight: true,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    pagination: {
                        el: pagination || '.swiper-pagination',
                        type: 'bullets',
                        clickable: true,
                    },
                    on: {
                        init: function () {
                            this.type = type;
                            this.currentSlide = 0;

                            switch (this.type) {
                                case "client" : {
                                    let elMultiplier = 9;
                                    let els = $(this.el).find('.swiper-slide');
                                    let curSlide = this.currentSlide;

                                    if (this.currentSlide <= 0) {
                                        curSlide = 1;
                                    }
                                    let offset = curSlide * elMultiplier;
                                    let from = this.currentSlide * elMultiplier;
                                    let offsetE = els.slice(from,offset);

                                    if (offsetE.length === 0) {
                                        offsetE = els.slice(offset);
                                    }
                                    elsHide = els;
                                    elsShow = offsetE;
                                }
                                default: return;
                            }

                        },
                        slideChangeTransitionStart: function() {
                            switch (this.type) {
                                case "review" : {
                                    let el = $(this.$el).find('.swiper-slide-active');

                                    let more = el.find('.more');
                                    let moreText = more.find('.text');

                                    let detail = $('.review-detail');
                                    let text = detail.find('.text');

                                    text.html(moreText.html());

                                    return;
                                }
                                case "client" : {
                                    console.log(this.currentSlide);
                                }
                                default: return;
                            }
                        },
                        slideNextTransitionStart: function () {
                            this.currentSlide++;

                            switch (this.type) {
                                case "client" : {
                                    slidesSlice(this.el, 'next');
                                }
                                default: return;
                            }
                        },
                        slidePrevTransitionStart: function () {
                            this.currentSlide--;

                            switch (this.type) {
                                case "client" : {
                                    slidesSlice(this.el, 'next');
                                }
                                default: return;
                            }
                        },
                    }
                });
                try {
                    $(elsHide).addClass('hide');
                    $(elsShow).removeClass('hide');
                }catch (e) {

                }
                Swipers.push(mobileSwiper);
            });
            swiperFix(Swipers);
            mobileInit = true;
        }else {
            if (mobileInit) {
                mobileInit = false;
                Array.prototype.forEach.call(Swipers, v => {
                    if(v) v.destroy();
                });
                Swipers = [];
                swipersInit();
            }
        }
    };
    window.onresize = onResizeFn;


    let reviewsSwiper, sertificatsSwiper, servicesSwiper, countSwiper, newsSwiper, desktopSwipers, booksSwiper;
    desktopSwipers = [];

    const swipersInit = () => {
        if (window.innerWidth <= mobileBreakpoint) {
            onResizeFn();
            return;
        }

        if (window.innerWidth <= 1500) {
            servicesSwiper = new Swiper('.swiper-container-services',
                Object.assign({}, defaultSwiperOptions, {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 80,
                    breakpoints: {
                        1280: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween: 80,
                        },
                        1080: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween: 30,
                        },
                        830: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            spaceBetween: 30,
                        },
                        640: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            spaceBetween: 30,
                        },
                        0: {
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                        }
                    },
                })
            );
            desktopSwipers.push(servicesSwiper);

            countSwiper = new Swiper('.swiper-container-count',
                Object.assign({}, defaultSwiperOptions, {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 50,
                    breakpoints: {
                        1280: {
                            slidesPerView: 4,
                            slidesPerGroup: 4,
                            spaceBetween: 50,
                        },
                        1080: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween: 30,
                        },
                        830: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            spaceBetween: 30,
                        },
                        0: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                        }
                    },
                    on: {
                        init: function () {
                            let el = $(this.$el);
                            let maxHeight = 0;
                            let fixHeight = 30;
                            Array.prototype.forEach.call(el.find('.item'), v => {
                                let height = v.getBoundingClientRect().height;
                                if (height > maxHeight) {
                                    maxHeight = height;
                                }
                            });
                            maxHeight += fixHeight;
                            $(this.el).attr('style', 'height: ' + maxHeight + 'px;max-height: ' + maxHeight + 'px');
                        }
                    }
                })
            );
            desktopSwipers.push(countSwiper);
        } else {
           // todo destroy swipers
        }

        if (window.innerWidth < 1280) {
            newsSwiper = new Swiper('.swiper-container-news',
                Object.assign({}, defaultSwiperOptions,{
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 55,
                    breakpoints: {
                        1280: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween: 55,
                        },
                        1080: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween: 30,
                        },
                        830: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            spaceBetween: 50,
                        },
                        640: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            spaceBetween: 40,
                        },
                        0: {
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                            spaceBetween: 40,
                        }
                    }
                })
            );
            desktopSwipers.push(newsSwiper);

            booksSwiper = new Swiper('.swiper-container-books',
                Object.assign({}, defaultSwiperOptions, {
                    slidesPerView: 5,
                    slidesPerGroup: 5,
                    spaceBetween: 30,
                    breakpoints: {
                        1280: {
                            slidesPerView: 5,
                            slidesPerGroup: 5,
                            spaceBetween: 30,
                        },
                        1080: {
                            slidesPerView: 5,
                            slidesPerGroup: 5,
                            spaceBetween: 30,
                        },
                        830: {
                            slidesPerView: 4,
                            slidesPerGroup: 4,
                            spaceBetween: 40,
                        },
                        640: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween: 40,
                        },
                        0: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                        }
                    }
                })
            );
            desktopSwipers.push(booksSwiper);
        } else {
            // todo destroy swipers
        }

        reviewsSwiper = new Swiper('.swiper-container-reviews', {
            direction: 'horizontal',
            autoHeight: !0,
            loop: !1,
            centeredSlides: false,
            freeMode: true,
            slidesPerView: 5,
            spaceBetween: 30,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                1500: {
                    slidesPerView: 5,
                },
                1280: {
                    slidesPerView: 4,
                },
                1080: {
                    slidesPerView: 3,
                },
                830: {
                    slidesPerView: 2,
                },
                577: {
                    slidesPerView: 2,
                }
            }
        });
        desktopSwipers.push(reviewsSwiper);

        sertificatsSwiper = new Swiper('.swiper-container-sertificat', {
            direction: 'horizontal',
            autoHeight: !0,
            loop: !1,
            centeredSlides: false,
            allowTouchMove: true,
            passiveListeners: false,
            simulateTouch: true,
            touchStartPreventDefault: false,
            followFinger: false,
            slidesPerView: 4,
            slidesPerGroup: 4,
            spaceBetween: 30,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                1500: {
                    slidesPerView: 4,
                    slidesPerGroup: 4,
                    spaceBetween: 30,
                },
                1280: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 30,
                },
                830: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 30,
                },
                640: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    spaceBetween: 30,
                },
                0: {
                    slidesPerView: 1,
                    slidesPerGroup: 1,
                }
            }
        });
        desktopSwipers.push(servicesSwiper);

        if (window.innerWidth <= 1400) {
            swiperFix(desktopSwipers);
        }
    };
    swipersInit();

    const slidesSlice = (el, type) => {
        const elMultiplier = 9;
        let els = $(el).find('.swiper-slide');
        let curSlide = this.currentSlide;
        if (this.currentSlide <= 0) {
            curSlide = 1;
        }
        let offset = curSlide * elMultiplier;
        let from = this.currentSlide * elMultiplier;
        let offsetE = undefined;
        if (type === 'next') {
            offsetE = els.slice(from, offset + elMultiplier);
        }else {
            offsetE = els.slice(from,offset-elMultiplier);
        }
        if (offsetE.length === 0) {
            offsetE = els.slice(offset);
        }
        if (type === 'next') {
            $(els).addClass('hide');
            $(offsetE).removeClass('hide');
        }else {
            $(els).removeClass('hide');
            $(offsetE).addClass('hide');
        }
    };

    $('.swiper-container-reviews .swiper-slide').on('click', function () {
        let el = $(this);
        let detail = $('.review-detail');
        let img = detail.find('.image img');
        let text = detail.find('.text');

        let more = el.find('.more');
        let moreImg = more.find('img');
        let moreText = more.find('.text');

        img.attr('src', moreImg.attr('src'));
        text.html(moreText.html());

        let viewer = new Viewer(img[0], {
            keyboard: false,
            movable: false,
            navbar: false,
            rotatable: false,
            scaleble: true,
            slideOnTouch: false,
            toggleOnDblclick: true,
            toolbar: false,
            tooltip: false,
            zoomable: true,
            zoomOnTouch: false,
            zoomOnWheel: true,
        });
    });

    $.each($('.sertificat-slide'), function (k, v) {
        let el = $(this).find('img')[0];
        let viewer = new Viewer(el, {
            keyboard: false,
            movable: false,
            navbar: false,
            rotatable: false,
            scaleble: true,
            slideOnTouch: false,
            toggleOnDblclick: true,
            toolbar: false,
            tooltip: false,
            zoomable: true,
            zoomOnTouch: false,
            zoomOnWheel: true,
        });
    });

    let clients = $('.clients-container .item');
    let clientsCnt = clients.length;

    window.submenu = {
        menu: null,
        subMenus: null,
        init: () => {
          let e = window.submenu;

          e.menu = $('.has-submenu');
          if (e.menu.length <= 0) {
              return;
          }
          e.subMenus = $('.has-submenu .submenu');

          e.menu.unbind('mouseover');
          e.menu.unbind('mouseleave');
          e.subMenus.unbind('mouseleave');

          e.menu.on('mouseover', function () {
              let submenu = $(this).find('.submenu');
              submenu.show();
          });
          e.menu.on('mouseleave', function () {
              let submenu = $(this).find('.submenu');
              if (submenu.css('display') == "block") {
                  submenu.hide();
              }
          });
          e.subMenus.on('mouseleave', () => {
              $(this).hide();
          });
        }
    };

    window.itemsFilter = {
        filter: null,
        swiperType: "filter",
        init: () => {
            let e = window.itemsFilter;

            e.filter = $('[data-filter]');
            if (e.filter.length <= 0) {
                return;
            }
            Array.prototype.forEach.call(e.filter, function (v) {
                v = $(v);
                let filterKeys = v.find('[data-filter-key]');
                let filterItemsContainer = $(v.attr('data-filter-items'));
                let filterItems = filterItemsContainer.find(".item");
                let select = v.find('select');

                select.unbind('select');
                filterKeys.unbind('click');

                if (window.innerWidth <= mobileBreakpoint) {
                    select.on('change', function () {
                        let el = select.find('option:selected');
                        let key = el.attr('data-filter-key');

                        e.filterItems('select', filterKeys, key, filterItems, filterItemsContainer, el);
                    });
                }else {
                    filterKeys.on('click', function () {
                        let el = $(this);
                        let key = el.attr('data-filter-key');

                        e.filterItems('click', filterKeys, key, filterItems, filterItemsContainer, el);
                    });
                }
            });
        },
        update: () => {
            let e = window.itemsFilter;

            if (Swipers.length <= 0 || window.innerWidth > mobileBreakpoint) return;
            Array.prototype.forEach.call(Swipers, function (v) {
                if (v.type === e.swiperType) {
                    v.update();
                }
            });
        },
        filterItems: (type, keys, key, items, container, el=null) => {
            let e = window.itemsFilter;

            if (type === 'click') {
                if (el.hasClass('active')) {
                    key = 0;
                    keys.removeClass('active');
                }else {
                    keys.removeClass('active');
                    el.addClass('active');
                }
            }

            if (key == 0 || key == 'all') {
                items.css('display', 'flex');
                e.update();
                return;
            }

            items.hide();
            let filtered = container.find('[data-fkey="' + key + '"]');
            filtered.css('display','flex');
            e.update();
        }
    };

    window.mobileMenu = {
        openBtn: null,
        closeBtn: null,
        mobileMenu: null,
        orientation: null,
        orientationBreakpoint: 2000,
        animationTime: 500,
        init: () => {
            let e = window.mobileMenu;

            e.mobileMenu = $('.mobile-menu-slide');
            if (e.mobileMenu.length <= 0) {
                return;
            }

            e.orientation = e.mobileMenu.attr('data-menu-orientation') || 'left';

            let left = "unset";
            let right = "unset";

            switch (e.orientation) {
                case 'left':
                {
                    left = -e.orientationBreakpoint;
                    break;
                }
                case 'right': {
                    right = -e.orientationBreakpoint;
                    break;
                }
                default: {
                    e.orientation = 'left';
                    left = -e.orientationBreakpoint;
                }
            }

            let style = document.createElement('style');
            style.id = 'mobile-menu-styles';
            style.innerHTML = '.mobile-menu-slide {' +
                    'display: flex;' +
                    '-webkit-transition: all ' + e.animationTime + ';' +
                    '-moz-transition: all ' + e.animationTime + ';' +
                    '-ms-transition: all ' + e.animationTime + ';' +
                    '-o-transition: all ' + e.animationTime + ';' +
                    'transition: all ' + e.animationTime + ';' +
                    'left: ' + left + ';' +
                    'right: ' + right + ';' +
                '}';
            // document.body.prepend(style);
            window.customStyles.append(style);

            e.openBtn = $('.mobile-menu-btn');
            e.closeBtn = $('.mobile-menu-btn--close');

            e.openBtn.unbind('click');
            e.closeBtn.unbind('click');

            e.openBtn.on('click', function () {
               e.toggleMenu();
            });
            e.closeBtn.on('click', function () {
                e.toggleMenu();
            });
        },
        toggleMenu: () => {
            let e = window.mobileMenu;

            if (parseInt(e.mobileMenu.css(e.orientation)) >= 0) {
                e.close();
            }else {
                e.open();
            }
        },
        open: () => {
            let e = window.mobileMenu;

            e.mobileMenu.animate({
                [e.orientation]: 0,
            }, e.animationTime);
            $('body').addClass('no-scroll');
        },
        close: () => {
            let e = window.mobileMenu;

            e.mobileMenu.animate({
                [e.orientation]: -e.orientationBreakpoint + 'px',
            }, e.animationTime);
            $('body').removeClass('no-scroll');
        }
    };

    window.customStyles = {
        stylesContainer: null,
        id: "theme_custom-styles",
        styles: null,
        init: () => {
            let e = window.customStyles;

            e.stylesContainer = $(e.id);

            if (e.stylesContainer.length <= 0) {
                let styles = document.createElement('div');
                styles.id = e.id;
                document.body.prepend(styles);
                e.stylesContainer = $('#' + e.id);
            }
        },
        append: (el) => {
            let e = window.customStyles;

            if (typeof(el) === "object") {
                e.stylesContainer.append(el);
                e.update();
                return true;
            }
            return false;
        },
        update: () => {
            let e = window.customStyles;
            e.styles = e.stylesContainer.find('style');
        }
    };

    window.popup = {
        init: () => {

        },
    };

    // always upper then other
    window.customStyles.init();

    window.submenu.init();
    window.itemsFilter.init();
    window.mobileMenu.init();

});