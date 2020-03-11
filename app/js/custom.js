"use strict";

$(function () {

    $('[type="tel"]').inputmask({ mask: "+7(999)999-99-99"});

    // Array.prototype.__proto__.findInstance = function(el) {
    //     for (let i = 0;i < this.length;i++) {
    //         if (this[i] === el) {
    //             return i;
    //         }
    //     }
    //     return false;
    // };

    // let wall = new Freewall(".audit-container");
    // wall.reset({
    //     selector: '.grid-item',
    //     animate: true,
    //     gutterX: 30,
    //     gutterY: 30,
    //     cellW: 'auto',
    //     cellH: 'auto',
    //     onResize: function () {
    //         wall.fitWidth();
    //     }
    // });
    // wall.fitWidth();

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

    $('.swiper-container-audit-partners .swiper-slide').on('click', function () {
        let el = $(this);
        let detail = $('.auditors-partners-detail');
        $('.swiper-container-audit-partners .swiper-slide').removeClass('active')
        el.addClass('active');
        let img = $(detail).find('img');
        let text = detail.find('.text');

        let more = el.find('.more');
        let moreImg = more.find('img');
        let moreText = more.find('.text');

        img.attr('src', moreImg.attr('src'));
        text.html(moreText.html());
    });

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

    let mobileInit = false;

    // fix height swiper sliders
    const swiperFix = (els) => {
        let count = 1;
        let swiperIntervalId = setInterval(function () {
            Array.prototype.forEach.call(els, (v) => {
                if (v.length && v.length > 0) {
                    Array.prototype.forEach.call(v, vv => {
                        if (vv) vv.update();
                    });
                }else {
                    console.log(v);
                    try {
                        if (v) v.update();
                    }catch (e) {

                    }
                }
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
                try {
                    if (v.length && v.length > 0) {
                        Array.prototype.forEach.call(v, vv => {
                            if (vv) vv.destroy();
                        });
                    }else {
                        if (v) v.destroy();
                    }
                }catch (e) {
                    try {
                        if (v) v.destroy();
                    }catch (e) {
                    }
                }

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
                                    replaceDetailContent($(this.$el), '.review-detail');
                                    return;
                                }
                                case "audit-partners": {
                                    replaceDetailContent($(this.$el), '.auditors-partners-detail');
                                    return;
                                }
                                case "client" : {
                                    console.log(this.currentSlide);
                                    return;
                                }
                                default: return;
                            }
                        },
                        slideNextTransitionStart: function () {
                            this.currentSlide++;

                            switch (this.type) {
                                case "client" : {
                                    slidesSlice(this.el, 'next', this.currentSlide);
                                }
                                default: return;
                            }
                        },
                        slidePrevTransitionStart: function () {
                            this.currentSlide--;

                            switch (this.type) {
                                case "client" : {
                                    slidesSlice(this.el, 'prev', this.currentSlide);
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
            if (countSwiper) {
                // countSwiper.destroy();
                // desktopSwipers.splice(desktopSwipers.indexOf(countSwiper), 1);
            }
            if (servicesSwiper) {
                // servicesSwiper.destroy();
                // desktopSwipers.splice(desktopSwipers.indexOf(servicesSwiper), 1);
            }
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
            if (booksSwiper) {
                // booksSwiper.destroy();
                // desktopSwipers.splice(desktopSwipers.indexOf(booksSwiper), 1);
            }
            if (newsSwiper) {
                // newsSwiper.destroy();
                // desktopSwipers.splice(desktopSwipers.indexOf(newsSwiper), 1);
            }
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

        let swiperAuditPartners = new Swiper('.swiper-container-audit-partners', Object.assign({}, defaultSwiperOptions, {
            slidesPerView: 6,
            slidesPerGroup: 1,
            spaceBetween: 25,
            on: {
                init: function () {
                    let items = $(this.$el).find('.item');
                    $(items[0]).click();
                }
            },
            breakpoints: {
                1700: {
                    slidesPerView: 6,
                },
                1280: {
                    slidesPerView: 5,
                },
                1080: {
                    slidesPerView: 4,
                },
                830: {
                    slidesPerView: 3,
                },
                640: {
                    slidesPerView: 2,
                },
                1: {
                    slidesPerView: 1,
                    width: 170,
                    height: 192
                }
            }
        }));
        desktopSwipers.push(swiperAuditPartners);

        if (window.innerWidth <= 1400) {
            console.log(desktopSwipers);
            swiperFix(desktopSwipers);
        }
    };
    swipersInit();

    const slidesSlice = (el, type, currentSlide) => {
        console.log(el, type);
        const elMultiplier = 9;
        let els = $(el).find('.swiper-slide');
        let curSlide = currentSlide;
        if (currentSlide <= 0) {
            curSlide = 1;
        }
        let offset = curSlide * elMultiplier;
        let from = currentSlide * elMultiplier;
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

    const replaceDetailContent = (el, cl) => {
        el = $(this.$el).find('.swiper-slide-active');

        let more = el.find('.more');
        let moreText = more.find('.text');

        let detail = $(cl);
        let text = detail.find('.text');

        text.html(moreText.html());
    };

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

    const inputsUpdate = () => {
        $.each($('.label-placeholder'), function (k, v) {
            let el = $(this);
            let inp = el.find('input');
            let pl = el.find('.pl');

            const focus = () => {
                inp.on('focus focusIn input', function () {
                    if (this.value) {
                        pl.hide();
                    }else {
                        pl.show();
                    }
                });
            };

            const blur = () => {
                inp.on('blur focusIn', function () {
                    if (this.value) {
                        pl.hide();
                    }else {
                        pl.show();
                    }
                });
            };

            inp.unbind('input',focus);
            inp.unbind('focus',focus);
            inp.unbind('focusIn',focus);

            inp.unbind('blur',blur);
            inp.unbind('focusOut',blur);

            focus();
            blur();
        });
    };

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
        remove: (id) => {
          $('#' + id).remove();
          window.customStyles.update();
        },
        update: () => {
            let e = window.customStyles;
            e.styles = e.stylesContainer.find('style');
        }
    };

    window.checkboxSelect = {
        selects: null,
        cl: '.checkbox-select',
        desktopRendered: false,
        init: () => {
            let e = window.checkboxSelect;

            e.selects = $(e.cl);

            if (e.selects.length <= 0) {
                return;
            }

            e.breakpointRender();

            $(window).on('resize', function () {
                e.breakpointRender();
            });

        },
        breakpointRender: () => {
            let e = window.checkboxSelect;

            if (window.innerWidth <= mobileBreakpoint) {
                e.regenMobile();
            }else {
                e.regenDesktop();
            }
        },
        regenDesktop: () => {
            let e = window.checkboxSelect;

            if (e.cl == ".checkbox-mb") {
                Array.prototype.forEach.call(e.selects, (v,k) => {
                    v = $(v);
                    let select = v.find('select');
                    let elements = select.find('option');

                    Array.prototype.forEach.call(elements, (vv, kk) => {
                        vv = $(vv);
                        v.append("<label for='" + vv.attr('data-id') + "'><input type='checkbox' id='" + vv.attr('data-id') + "' name='" + vv.attr('data-name') + "' value='" + vv.val() + "'><span>" + vv.val() + "</span></label>");
                    });

                    v.removeClass('select select-2 checkbox-mb');
                    v.addClass('checkbox-select');

                    select.remove();
                    v.find('span.mdi').remove();
                });
                e.cl = ".checkbox-select";
            }

            if (e.cl == ".checkbox-select" && e.desktopRendered == false) {
                Array.prototype.forEach.call(e.selects, (v,k) => {
                    v = $(v);
                    let elements = v.find('label');
                    let checkbox = v.find('input[type="checkbox"]');

                    checkbox.unbind('input');
                    checkbox.unbind('changed');

                    checkbox.on('input changed', function (ev) {
                        e.onChange(ev, this, checkbox);
                    });
                });
                e.selects = $(e.cl);
                e.desktopRendered = true;
            }
        },
        regenMobile: () => {
            let e = window.checkboxSelect;

            if (e.cl == ".checkbox-mb") {
                return;
            }

            Array.prototype.forEach.call(e.selects, (v,k) => {
                v = $(v);
                let elements = $(v).find('label');
                let checkbox = v.find('input[type="checkbox"]');

                e.cl = '.checkbox-mb';

                v.addClass('select select-2 checkbox-mb');
                v.removeClass('checkbox-select');

                let select = document.createElement('select');
                v.append(select);
                select = v.find('select');
                Array.prototype.forEach.call(elements, (vv,kk) => {
                    vv = vv.querySelector('input');
                    select.append("<option data-name='" + vv.name + "' data-id='" + vv.id + "' value='" + vv.value + "'>" + vv.value + "</option>")
                });

                v.find('label').remove();
                v.append("<span class=\"mdi mdi-chevron-down\"></span>");

            });

            e.selects = $(e.cl);
            e.desktopRendered = false;
        },
        onChange: (event, target, elements) => {
            let e = window.checkboxSelect;
            target = $(target);
            $(elements).prop('checked', false);
            target.prop('checked', true);
        }
    };

    window.popup = {
        popups: null,
        currentPopup: null,
        background: null,
        offset: 0,
        cl: 'popup-box',
        callers: null,
        headContainer: null,
        container: null,
        animationTime: 500,
        replaceContainer: null,
        mmBreackpoint: 1080,
        parseBool: null,
        parseObj: null,
        init: () => {
            let e = window.popup;

            e.popups = $('.' + e.cl);

            if (e.popups.length <= 0) {
                return;
            }

            e.parseBool = (string) => {
                switch(string.toLowerCase().trim()){
                    case "true": case "yes": case "1": return true;
                    case "false": case "no": case "0": case null: return false;
                    default: return Boolean(string);
                }
            };

            e.parseObj = (string) => {
                string = string.split('{').join('');
                string = string.split('}').join('');
                let properties = string.split(',');
                let obj = {};
                properties.forEach(function(property) {
                    let kv = property.split(':');
                    obj[kv[0]] = kv[1];
                });
                return obj;
            };

            if (!e.container) {
                let container = document.createElement('div');
                container.className = 'theme_popups-container';
                document.body.prepend(container);
                e.headContainer = $('.theme_popups-container');
            }

            if (!e.background) {
                e.headContainer.append("<div class='popups-background'><div class='popups-container container'></div></div>");
                e.background = $('.theme_popups-container .popups-background');
                e.container = $('.theme_popups-container .popups-container');
            }

            e.background.on('click', (evt) => {
                if (evt.target == e.background[0]) {
                    e.closeActive();
                }
            });

            Array.prototype.forEach.call(e.popups, (v, k) => {
                e.append(v.id);
            });
            e.update();

            e.onResize();
        },
        show: (popupId) => {
            let e = window.popup;

            let popup = $('#' + popupId);
            let replace = false;

            if (popup.attr('data-replace') == 'true') {
                let options = {
                    id: 'popup_content_container',
                    className: popup[0].className,
                    closable: null,
                    replace: popup.attr('data-replace') || false,
                    offsetType: popup.attr('data-offset-type') || null,
                    offset: popup.attr('data-offset') || null,
                    html: popup[0].innerHTML,
                    mmBreackpoint: popup.attr('data-mm-breackpoint') || false,
                    closeAfter: popup.attr('data-close-after') || false
                };
                if (e.replaceContainer === null) {
                    e.replaceContainer = e.create(options);
                }else {
                    e.replaceContainer[0].className = options.className;
                    e.replaceContainer.attr('data-replace', options.replace);
                    e.replaceContainer.attr('data-offset-type', options.offsetType);
                    e.replaceContainer.attr('data-offset', options.offset);
                    e.replaceContainer.attr('data-mm-breackpoint', options.mmBreackpoint);
                    e.replaceContainer.attr('data-close-after', options.closeAfter);
                }
                popup = e.replaceContainer;
                replace = true;
            }

            e.currentPopup = popup;

            let offsetEl = popup.attr('data-offset');
            let offset = null;
            let offsetType = popup.attr('data-offset-type');
            if (offsetEl) {

                offset = e.getOffset(offsetEl, offsetType);

                popup.css(Object.assign({}, offset ,{
                    position: 'absolute',
                }));

                try {
                    $(offsetEl);

                    let style = document.createElement('style');
                    style.id = 'popup-target-styles__' + popup[0].id;
                    style.innerHTML = popup.attr('data-offset') + ', ' + popup.attr('data-offset') + ' * {' +
                        'z-index: 130;' +
                        '}';

                    window.customStyles.append(style, 'popup-target-styles__' + popup[0].id);
                }catch (exp) {
                }
            }

            if (replace) {
                popup[0].innerHTML = $('#' + popupId)[0].innerHTML;
                e.update();
            }
            popup.show();
            $('html').addClass('no-scroll');
            e.headContainer.fadeIn(e.animationTime);
        },
        append: (popupId) => {
            let e = window.popup;

            let el = $('#' + popupId);
            let v = el[0];

            let popup = e.create({
                id: v.id,
                className: v.className,
                closable: el.attr('data-closable'),
                replace: el.attr('data-replace') || false,
                offsetType: el.attr('data-offset-type') || null,
                offset: el.attr('data-offset') || null,
                html: v.innerHTML,
                mmBreackpoint: el.attr('data-mm-breackpoint') || false,
                closeAfter: el.attr('data-close-after') || false
            });
            v.remove();
            e.update();
        },
        create: (options) => {
            let e = window.popup;

            e.container.append("<div class='" + options.className + (e.parseBool(options.className) == false ? '' : ' closable') + "' id='" + options.id + "' data-close-after='" + options.closeAfter + "' data-replace='" + options.replace + "' data-mm-breackpoint='" + options.mmBreackpoint + "' data-offset-type='" + options.offsetType + "' data-offset='" + options.offset + "'>" + options.html + "</div>");

            e.update();

            return $('#' + options.id);
        },
        close: (popupId) => {
            let e = window.popup;

            window.customStyles.remove('popup-target-styles__' + $('#' + popupId)[0].id);
            e.headContainer.fadeOut(e.animationTime, () => {
                $('html').removeClass('no-scroll');
            });
        },
        closeActive: (timeout) => {
            let e = window.popup;

            const closeFn = () => {
                if (e.currentPopup) {
                    e.currentPopup.attr('style', '');
                    e.currentPopup.hide();
                }

                if (e.currentPopup) {
                    window.customStyles.remove('popup-target-styles__' + e.currentPopup[0].id);
                }
                e.headContainer.fadeOut(e.animationTime, () => {
                    $('html').removeClass('no-scroll');
                });

                e.currentPopup = null;
            };

            let after = null;
            if (e.currentPopup) {
                after = e.currentPopup.attr('data-close-after') || timeout;
            }
            if (after) {
                setTimeout( closeFn,parseInt(after) * 1000);
            }else {
                closeFn();
            }
        },
        getOffset: (el, type) => {
            try {
                el = $(el)[0];
            }catch (e) {
                try {
                    let obj = window.popup.parseObj(el);
                    if ((obj.hasOwnProperty('left') && obj.left === '50%') && (obj.hasOwnProperty('top') && obj.top === '50%')) {
                        obj.transform = "translate(-50%, -50%)";
                    }
                    if (obj.hasOwnProperty('left') && obj.left === '50%') {
                        obj.transform = "translateX(-50%)";
                    }
                    return obj;
                }catch (e) {
                    return null
                }
            }

            let rect = el.getBoundingClientRect();

            switch (type) {
                case 'after' : {
                    return {
                        top: rect.top + rect.height,
                    };
                    break;
                }
                case 'before' : {
                    return {
                        top: rect.top,
                    };
                    break;
                }
                case 'center' : {
                    return {
                        top: rect.top + (rect.height / 2),
                    };
                    break;
                }
                default: return false;
            }
        },
        update: () => {
            let e = window.popup;

            e.popups = $('.' + e.cl);

            Array.prototype.forEach.call(e.popups, v => {
                v = $(v);
                let closer = v.find('.close-popup');
                closer.unbind('click');
                closer.on('click', function () {
                    e.closeActive();
                });
            });

            e.callers = $('[data-popup-target]');
            e.callers.unbind('click');

            e.callers.on('click', function (event) {
                let el = $(this);
                event.preventDefault();

                let popupId = el.attr('data-popup-target');
                e.show(popupId);
            });

            inputsUpdate();
        },
        onResize: () => {
            let e = window.popup;

            const resizeFn = () => {
                let popup = e.currentPopup;

                if (!popup) {
                    return;
                }

                if (e.parseBool(e.currentPopup.attr('data-mm-breackpoint')) === true && window.innerWidth <= e.mmBreackpoint) {
                    e.closeActive();
                }else {
                    if (popup.is(':hidden')) {
                        e.show(popup[0].id);
                    }
                }

                let offsetEl = popup.attr('data-offset');
                let offset = null;
                let offsetType = popup.attr('data-offset-type');

                offset = e.getOffset(offsetEl, offsetType);

                popup.css(Object.assign({}, offset ,{
                    position: 'absolute',
                }));
            };

            $(window).on('resize', function () {
                resizeFn();
            });
            resizeFn();
        }
    };

    // always upper then other
    window.customStyles.init();

    window.submenu.init();
    window.itemsFilter.init();
    window.mobileMenu.init();
    window.popup.init();
    window.checkboxSelect.init();

    // let $grid = $('.audit-container').masonry({
    //     itemSelector: '.grid-item',
    //     // columnWidth: 366,
    //     gutter: 0,
    //     resize: true,
    //     // fitWidth: true
    // });

});