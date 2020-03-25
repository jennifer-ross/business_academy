"use strict";

$(function () {

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
                if (v && v['length'] && v.length > 0) {
                    Array.prototype.forEach.call(v, vv => {
                        if (vv.hasOwnProperty('destroy')) vv.destroy();
                    });
                }else {
                    if (v && v.hasOwnProperty('destroy')) v.destroy();
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
                if (v && v['length'] && v.length > 0) {
                    Array.prototype.forEach.call(v, vv => {
                        if (vv.hasOwnProperty('destroy')) vv.destroy();
                    });
                }else {
                    if (v && v.hasOwnProperty('destroy')) v.destroy();
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


    let reviewsSwiper, sertificatsSwiper, servicesSwiper, countSwiper, newsSwiper, desktopSwipers, booksSwiper, visitSeminarSwiper, allBooksSwiper, videosSwiper;
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
                    navigation: {
                        nextEl: '.section-services .swiper-button-next',
                        prevEl: '.section-services .swiper-button-prev',
                    },
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
                    navigation: {
                        nextEl: '.section-count .swiper-button-next',
                        prevEl: '.section-count .swiper-button-prev',
                    },
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

            visitSeminarSwiper = new Swiper('.swiper-container-visit-seminars',
                Object.assign({}, defaultSwiperOptions, {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    spaceBetween: 30,
                    navigation: {
                        nextEl: '.section-visit-seminars .swiper-button-next',
                        prevEl: '.section-visit-seminars .swiper-button-prev',
                    },
                    breakpoints: {
                        1500: {
                            slidesPerView: 3,
                            slidesPerGroup: 3,
                            spaceBetween: 30,
                        },
                        1280: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            spaceBetween: 30,
                        },
                        1080: {
                            slidesPerView: 2,
                            slidesPerGroup: 2,
                            spaceBetween: 30,
                        },
                        830: {
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                            spaceBetween: 30,
                        },
                        640: {
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                            spaceBetween: 40,
                        },
                        0: {
                            slidesPerView: 1,
                            slidesPerGroup: 1,
                        }
                    }
                })
            );
            desktopSwipers.push(visitSeminarSwiper);
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
                    navigation: {
                        nextEl: '.section-news .swiper-button-next',
                        prevEl: '.section-news .swiper-button-prev',
                    },
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
                    navigation: {
                        nextEl: '.books-block .swiper-button-next',
                        prevEl: '.books-block .swiper-button-prev',
                    },
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
                nextEl: '.section-reviews .swiper-button-next',
                prevEl: '.section-reviews .swiper-button-prev',
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

        allBooksSwiper = new Swiper('.section-books .books-container', Object.assign({}, defaultSwiperOptions, {
                slidesPerView: 6,
                slidesPerGroup: 1,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.section-books .swiper-button-next',
                    prevEl: '.section-books .swiper-button-prev',
                },
                pagination: {
                    el: '.section-books .swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                },
                breakpoints: {
                    1500: {
                        slidesPerView: 6,
                    },
                    1280: {
                        slidesPerView: 5,
                        slidesPerGroup: 5,
                    },
                    1080: {
                        slidesPerView: 4,
                        slidesPerGroup: 4,
                    },
                    830: {
                        slidesPerView: 3,
                        slidesPerGroup: 3,
                    },
                    577: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                    },
                    0: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                    }
                }
            })
        );
        desktopSwipers.push(allBooksSwiper);

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
                nextEl: '.section-sertificats .swiper-button-next',
                prevEl: '.section-sertificats .swiper-button-prev',
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
            navigation: {
                nextEl: '.section-auditors-partners .swiper-button-next',
                prevEl: '.section-auditors-partners .swiper-button-prev',
            },
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

        videosSwiper = new Swiper('.section-video-slide .videos-container', Object.assign({}, defaultSwiperOptions, {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.section-video-slide .swiper-button-next',
                    prevEl: '.section-video-slide .swiper-button-prev',
                },
                pagination: {
                    el: '.section-video-slide .swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                },
                breakpoints: {
                    1500: {
                        slidesPerView: 3,
                        spaceBetween: 30,
                    },
                    1280: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    1080: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    830: {
                        slidesPerView: 2,
                        spaceBetween: 30,
                    },
                    0: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 60,
                    }
                }
            })
        );
        desktopSwipers.push(videosSwiper);

        let descountSwiper = new Swiper('.section-discounts .discounts-container', Object.assign({}, defaultSwiperOptions, {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.section-discounts .swiper-button-next',
                    prevEl: '.section-discounts .swiper-button-prev',
                },
                pagination: {
                    el: '.section-discounts .swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                },
            })
        );
        desktopSwipers.push(descountSwiper);

        let visitSeminarSwiper2 = new Swiper('.visit-seminars-2 .swiper-container-visit-seminars',
            Object.assign({}, defaultSwiperOptions, {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.visit-seminars-2 .swiper-button-next',
                    prevEl: '.visit-seminars-2 .swiper-button-prev',
                },
                breakpoints: {
                    1500: {
                        slidesPerView: 3,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    1280: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        spaceBetween: 30,
                    },
                    1080: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        spaceBetween: 30,
                    },
                    830: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    640: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 40,
                    },
                    0: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                    }
                }
            })
        );
        desktopSwipers.push(visitSeminarSwiper2);

        let reportsSwiper = new Swiper('.section-reports .swiper-container-reports',
            Object.assign({}, defaultSwiperOptions, {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.section-reports .swiper-button-next',
                    prevEl: '.section-reports .swiper-button-prev',
                },
                pagination: {
                    el: '.section-reports .swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                },
                on: {
                    init: function () {
                        // let el = $(this.$el);
                        // let maxHeight = 0;
                        // let fixHeight = 5;
                        // Array.prototype.forEach.call(el.find('.item'), v => {
                        //     let height = v.getBoundingClientRect().height;
                        //     if (height > maxHeight) {
                        //         maxHeight = height;
                        //     }
                        // });
                        // maxHeight += fixHeight;
                        // $(this.el).attr('style', 'height: ' + maxHeight + 'px;');
                    }
                },
                breakpoints: {
                    1500: {
                        slidesPerView: 3,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    1280: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    1080: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    830: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    640: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 40,
                    },
                    0: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                    }
                }
            })
        );
        desktopSwipers.push(reportsSwiper);

        let photosSwiper = new Swiper('.section-photo .swiper-container-photo',
            Object.assign({}, defaultSwiperOptions, {
                slidesPerView: 4,
                slidesPerGroup: 1,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.section-reports .swiper-button-next',
                    prevEl: '.section-reports .swiper-button-prev',
                },
                pagination: {
                    el: '.section-photo .swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                },
                breakpoints: {
                    1500: {
                        slidesPerView: 4,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    1280: {
                        slidesPerView: 3,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    1080: {
                        slidesPerView: 3,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    830: {
                        slidesPerView: 2,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    },
                    640: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 40,
                    },
                    0: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                    }
                }
            })
        );
        desktopSwipers.push(photosSwiper);

        let articlesSwiper = new Swiper('.section-articles .swiper-container-articles',
            Object.assign({}, defaultSwiperOptions, {
                slidesPerView: 2,
                slidesPerGroup: 2,
                spaceBetween: 30,
                navigation: {
                    nextEl: '.section-articles .swiper-button-next',
                    prevEl: '.section-articles .swiper-button-prev',
                },
                pagination: {
                    el: '.section-articles .swiper-pagination',
                    type: 'bullets',
                    clickable: true,
                },
                breakpoints: {
                    1080: {
                        slidesPerView: 2,
                        slidesPerGroup: 2,
                        spaceBetween: 30,
                    },
                    0: {
                        slidesPerView: 1,
                        slidesPerGroup: 1,
                        spaceBetween: 30,
                    }
                }
            })
        );
        desktopSwipers.push(articlesSwiper);

        if (window.innerWidth <= 1400) {
            swiperFix(desktopSwipers);
        }
    };
    swipersInit();

    const slidesSlice = (el, type, currentSlide) => {
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

    const phoneFieldsUpdate = () => {
        $('[type="tel"]').inputmask({ mask: "+7(999)999-99-99"});
    };

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

                    if (this.type === 'tel') {
                        pl.hide();
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

            const hover = () => {
                inp.on('mouseover', function () {
                    if (this.type === 'tel') {
                        pl.hide();
                    }
                });
            };

            const unhover = () => {
                inp.on('mouseleave', function () {
                    if (this.type === 'tel' && this.value === '' && !$(this).is(':focus')) {
                        pl.show();
                    }
                });
            };

            inp.unbind('input',focus);
            inp.unbind('focus',focus);
            inp.unbind('focusIn',focus);

            inp.unbind('blur',blur);
            inp.unbind('focusOut',blur);

            inp.unbind('mouseover',hover);
            inp.unbind('mouseleave',hover);

            focus();
            blur();
            hover();
            unhover();
        });
    };

    $('.show-more, .show-all').on('click', function (e) {
       e.preventDefault();
       $($(this).parents()[2]).find('.items-container').addClass('unhide');
       $($(this).parents()[2]).find('.seminars-container').addClass('unhide');
       $($(this).parents()[2]).find('.clients-brick-container').addClass('unhide');
       $(this).hide();
    });

    let clients = $('.clients-container .item');
    let clientsCnt = clients.length;

    phoneFieldsUpdate();

    window.helper = {
      parseBool: (string) => {
          if (string == undefined) return false;

          switch(string.toLowerCase().trim()){
              case "true": case "yes": case "1": return true;
              case "false": case "no": case "0": case null: return false;
              default: return Boolean(string);
          }
      },
      parseObj: (string) => {
          string = string.split('{').join('');
          string = string.split('}').join('');
          let properties = string.split(',');
          let obj = {};
          properties.forEach(function(property) {
              let kv = property.split(':');
              obj[kv[0]] = kv[1];
          });
          return obj;
      },
    };

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
        filters: [],
        swiperType: "filter",
        init: () => {
            let e = window.itemsFilter;

            e.filter = $('[data-filter]');
            if (e.filter.length <= 0) {
                return;
            }

            Array.prototype.forEach.call(e.filter, function (v, k) {
                v = $(v);

                e.filters[k] = {
                    filter: v,
                    filterKeys: v.find('[data-filter-key]'),
                    filterContainer: $(v.attr('data-filter-items')),
                    select: v.find('select'),
                    hasPaginator: window.helper.parseBool(v.attr('data-paginator')),
                    search: $(v.attr('data-search')),
                    key: 0,
                    skey: 0,
                    paginator: {
                        dom: null,
                    },
                    dateFilter: {
                        dom: $(v.attr('data-dfilter'))
                    },
                    subfilter: v.find('.subfilter'),
                    subfilterKeys: v.find('[data-sfilter-key]'),
                    hasSubfilter: window.helper.parseBool(v.attr('data-subfilter')),
                    hasDateFilter: window.helper.parseBool(v.attr('data-date-filter')),
                    filteredItems: [],
                    count: 0,
                    dataCount: v.attr('data-count'),
                    hasSearch: false,
                    searchVal: "",
                    dateVal: "",
                    unhide: $(v.attr('data-unhide')),
                    countPages: 0,
                    currentPage: 1,
                };

                let self = e.filters[k];

                self['items'] = e.toObject(e.filters[k].filterContainer.find(".item"));
                self.search.attr('data-filter-items', v.attr('data-filter-items'));
                self['searchInp'] = self.search.find('input');
                self['searchBtn'] = self.search.find('.btn-search');

                if (self.hasDateFilter) {

                    self.dateFilter.input = self.dateFilter.dom.find('input');
                    self.dateFilter.btn = self.dateFilter.dom.find('button');

                    self.dateFilter.btn.attr('data-key', k);

                    let lp = self.dateFilter.input.datepicker({
                        toggleSelected: false,
                        range: true,
                        onSelect: function (formattedDate, date, inst) {
                            self.dateVal = date;
                        },
                        onHide: function (inst, animationCompleted) {
                            console.log(self.dateVal);
                        }
                    });

                    self['dateFilterPick'] = lp.data('datepicker');

                    self.dateFilter.btn.on('click', function (e) {
                       let self = window.itemsFilter.filters[$(this).attr('data-key')];
                       self.dateFilterPick.show();
                    });
                }

                self.searchBtn.on('click', function (evt) {
                    e.search(k, evt, this);
                });

                self.searchInp.on('keyup', function (evt) {
                    if (evt.keyCode === 13) {
                        e.search(k, evt, this);
                    }
                });

                self.searchInp.on('input', function (evt) {
                    let value = $(this).val();
                    self.searchVal = value;
                    if (!value) {
                        self.hasSearch = false;
                    }
                });

                self.select.unbind('select');
                self.filterKeys.unbind('click');

                const filterChangeFn = (type, _this=null, subfilter=false) => {
                    let el = null;

                    if (type === 'select') {
                        el = self.select.find('option:selected');
                    }else {
                        el = $(_this);
                    }

                    let key = el.attr('data-filter-key');
                    let skey = el.attr('data-sfilter-key');

                    if ((key == 0 || key == '0') && !key) {
                        key = 0;
                    }else if(!key) {
                        key = self.key;
                    }

                    if ((skey == 0 || skey == '0') && !skey) {
                        skey = 0;
                    }else if (!skey) {
                        skey = self.skey;
                    }

                    self.key = key;
                    self.skey = skey;

                    if (self.hasPaginator) {

                        if (type === 'click') {
                            if (self.hasSubfilter && subfilter) {
                                if (el.hasClass('active')) {
                                    self.subfilterKeys.removeClass('active');
                                    self.skey = 0;
                                } else {
                                    self.subfilterKeys.removeClass('active');
                                    self.subfilter.find('[data-sfilter-key="' + self.skey + '"]').addClass('active');
                                }
                                self.key = 0;
                                self.filterKeys.removeClass('active');
                                self.filter.find('[data-filter-key="' + self.key +'"]').addClass('active');
                            }else {
                                if (el.hasClass('active')) {
                                    self.filterKeys.removeClass('active');
                                    self.key = 0;
                                }
                                self.filterKeys.removeClass('active');
                                self.filter.find('[data-filter-key="' + self.key +'"]').addClass('active');
                            }
                        }

                        if (self.hasSubfilter) {
                            if ( (self.key === 0 && self.skey === 0) || (self.key === '0' && self.skey === '0')) {
                                self.filteredItems = self.items;
                            }else if (self.skey === 0 || self.skey === '0') {
                                self.filteredItems = e.toObject(self.filterContainer.find('[data-fkey="' + self.key +'"]'));
                            }else if(self.key === 0 || self.key === '0') {
                                self.filteredItems = e.toObject(self.filterContainer.find('[data-skey="' + self.skey + '"]'));
                            }else {
                                self.filteredItems = e.toObject(self.filterContainer.find('[data-fkey="' + self.key +'"][data-skey="' + self.skey + '"]'));
                            }
                        }else {
                            if (self.key === 0 || self.key === '0') {
                                self.filteredItems = self.items;
                            }else {
                                self.filteredItems = e.toObject(self.filterContainer.find('[data-fkey="' + self.key +'"]'));
                            }
                        }

                        let paginator = self.filterContainer.parent().find('.paginator');
                        if (paginator && !self.paginator) {
                            self.paginator.dom = paginator;
                        }

                        self.count = Math.ceil(self.filteredItems.length / self.dataCount);
                        self.currentPage = 1;

                        if (self.hasSearch) {
                            e.search(k, {}, _this);
                        }else {
                            e.generatePages(k);
                            e.filterItems2(k);
                        }
                    }else {
                        e.filterItems3(k, type, _this);
                    }
                };

                if (window.innerWidth <= mobileBreakpoint) {
                    self.select.on('change', function () {
                        filterChangeFn('select');
                    });

                    if (self.hasPaginator) {
                        e.generatePagination(k);
                        e.unhide2({target: null}, k);
                        filterChangeFn('click', undefined, true);
                    }
                }else {
                    self.filterKeys.on('click', function () {
                        e.unhide2({target: self.unhide}, k);
                        filterChangeFn('click', this);
                    });

                    self.unhide.on('click', (evt) => {
                        e.unhide2(evt, k);
                    });
                }

                self.subfilterKeys.on('click', function () {
                    e.unhide2({target: self.unhide}, k);
                    filterChangeFn('click', this, true);
                });

                self.filteredItems = Array.from(self.items);

                e.onResize(k);
            });
        },
        unhide2: (evt, k) => {
            let e = window.itemsFilter;

            let self = e.filters[k];

            if (evt.hasOwnProperty('preventDefault')) evt.preventDefault();

            let paginator = self.filterContainer.parent().find('.paginator');
            let hasGen = paginator.length > 0 ? true : false;

            if (hasGen) {
                self.paginator.dom = paginator;
            }

            if (!hasGen && window.innerWidth > mobileBreakpoint) {
                self.filterContainer.addClass('unhide');

                if (self.hasPaginator) {
                    self.paginator = e.generatePagination(k);
                    self.hasPaginator = true;
                    self.paginator.dom.show();
                }

                $(evt.target).hide();
            }else {
                if (self.hasPaginator && self.paginator.dom) {
                    self.paginator.dom.show();
                }
            }
        },
        generatePagination: (k) => {

            let e = window.itemsFilter;
            let self = e.filters[k];

            let pagContainer = self.filterContainer.parent();

            if (pagContainer.find('.paginator').length === 0) {
                pagContainer.append("<div class='paginator' style='display: none'></div>");
            }

            let paginator = pagContainer.find('.paginator');
            paginator.attr('data-cur-page', 1);
            let currentPage = 1;

            if (paginator.find('.prev').length === 0) {
                paginator.append("<span class='prev' data-key='" + k + "'><span class='mdi mdi-chevron-left'></span></span>");
            }
            if (paginator.find('.pages').length === 0) {
                paginator.append("<div class='pages' data-key='" + k + "'></div>");
            }

            let pagesContainer = pagContainer.find('.pages');

            if (paginator.find('.next').length === 0) {
                paginator.append("<span class='next' data-key='" + k + "'><span class='mdi mdi-chevron-right'></span></span>");
            }

            self.currentPage = 1;
            self['paginator'] = {
                prevBtn: null,
                nextBtn: null,
                pages: null,
                dom: paginator,
                pagesContainer: pagesContainer
            };

            e.generatePages(k);
            e.filterItems2(k);

            pagesContainer.find('[data-page="' + currentPage +'"]').addClass('active');

            return self.paginator;
        },
        generatePages: (k) => {
            let e = window.itemsFilter;
            let self = e.filters[k];

            if (!self.paginator.dom) {
                // e.generatePagination(k);
                e.unhide2({target: null}, k);
            }

            self.paginator.pagesContainer.find('.page').remove();
            self.paginator.pagesContainer.find('.spacer').remove();

            let spBefore = false;
            let hiddenItems = 0;

            self.count = Math.ceil(self.filteredItems.length / self.dataCount);

            for (let i = 1; i <= self.count; i++) {
                if (self.count && !spBefore && self.count > 3) {
                    self.paginator.pagesContainer.append("<span class='page' data-key='" + k + "' data-page='" + 1 + "'  id='page_" + 1 + "'>" + 1 + "</span>");
                    self.paginator.pagesContainer.append("<span class='spacer'>...</span>");
                    spBefore = true;
                    continue;
                }
                if (spBefore && i < self.currentPage-4) {
                    hiddenItems++;
                    continue;
                }

                if (i === self.currentPage) {
                    self.paginator.pagesContainer.append("<span class='page active' data-key='" + k + "' data-page='" + i + "'  id='page_" + i + "'>" + i + "</span>");
                }else {
                    self.paginator.pagesContainer.append("<span class='page' data-key='" + k + "' data-page='" + i + "'  id='page_" + i + "'>" + i + "</span>");
                }

                if (((i >= hiddenItems+5) || (i >= self.currentPage+5) || (self.currentPage === 1 && i >= 5)) ) {
                    self.paginator.pagesContainer.append("<span class='spacer'>...</span>");
                    self.paginator.pagesContainer.append("<span class='page' data-key='" + k + "' data-page='" + self.count + "'  id='page_" + self.count + "'>" + self.count + "</span>");
                    break;
                }
            }

            let prev = self.paginator.dom.find('.prev');
            let next = self.paginator.dom.find('.next');
            let pages = self.paginator.pagesContainer.find('.page');

            self.paginator.prevBtn = prev;
            self.paginator.nextBtn = next;
            self.paginator.pages = pages;

            self.paginator.pages.unbind('click');
            self.paginator.prevBtn.unbind('click');
            self.paginator.nextBtn.unbind('click');

            const onChangePageFn = (_this,type=null) => {
                let e = window.itemsFilter;
                let el = $(_this);
                let k = parseInt(el.attr('data-key'));
                let self = e.filters[k];

                let page = parseInt(el.attr('data-page'));

                if (type === 'prev') {
                    page = --self.currentPage;
                    if (page <= 0) {
                        page = 1;
                    }
                }else if (type === 'next') {
                    page = ++self.currentPage;
                    if (page >= self.count) {
                        page = self.count;
                    }
                }

                self.currentPage = page;

                if (!self.paginator.pagesContainer) {
                    self.paginator.pagesContainer = el.parent();
                }
                if (!self.paginator.dom) {
                    self.paginator.dom = self.paginator.pagesContainer.parent();
                }

                // let filterItems = null;
                // if (self.key == 0 || self.key == '0') {
                //     filterItems = self.items;
                // }else {
                //     filterItems = e.toObject(self.filterContainer.find('[data-fkey="' + self.key +'"]'));
                // }

                // TODO make as fn
                if (self.hasSubfilter) {
                    if ( (self.key === 0 && self.skey === 0) || (self.key === '0' && self.skey === '0')) {
                        self.filteredItems = self.items;
                    }else if (self.skey === 0 || self.skey === '0') {
                        self.filteredItems = e.toObject(self.filterContainer.find('[data-fkey="' + self.key +'"]'));
                    }else if(self.key === 0 || self.key === '0') {
                        self.filteredItems = e.toObject(self.filterContainer.find('[data-skey="' + self.skey + '"]'));
                    }else {
                        self.filteredItems = e.toObject(self.filterContainer.find('[data-fkey="' + self.key +'"][data-skey="' + self.skey + '"]'));
                    }
                }else {
                    if (self.key === 0 || self.key === '0') {
                        self.filteredItems = self.items;
                    }else {
                        self.filteredItems = e.toObject(self.filterContainer.find('[data-fkey="' + self.key +'"]'));
                    }
                }

                // self.filteredItems = filterItems;

                e.generatePages(k);
                e.filterItems2(k);
            };

            self.paginator.pages.on('click', function () {
                onChangePageFn(this);
            });

            prev.on('click', function () {
                onChangePageFn(this, 'prev');
            });

            next.on('click', function () {
                onChangePageFn(this, 'next');
            });
        },
        filterItems2: (k) => {
            let e = window.itemsFilter;
            let self = e.filters[k];

            Array.prototype.forEach.call(self.items, (v) => {
                $(v.link).hide();
            });

            if (self.count > 1) {
                Array.prototype.forEach.call(self.filteredItems.slice((self.currentPage-1)*self.dataCount, self.currentPage*self.dataCount), (v) => {
                    $(v.link).show();
                });
            }else {
                Array.prototype.forEach.call(self.filteredItems.slice((self.currentPage-1)*self.dataCount), (v) => {
                    $(v.link).show();
                });
            }
        },
        filterItems3: (k, type, _this) => {
            let e = window.itemsFilter;
            let self = e.filters[k];

            let el = $(_this);
            let key = el.attr('data-filter-key');

            self.key = key;

            e.unhide2({target: self.unhide}, k);

            if (type === 'click') {
                if (el.hasClass('active')) {
                    key = 0;
                    self.filterKeys.removeClass('active');
                }else {
                    self.filterKeys.removeClass('active');
                    el.addClass('active');
                }
            }

            if (key == 0 || key == 'all') {
                Array.prototype.forEach.call(self.items, (v) => {
                    $(v.link).css('display', 'flex');
                });
                e.update();
                return;
            }

            Array.prototype.forEach.call(self.items, (v) => {
                $(v.link).hide();
            });

            self.filteredItems = e.toObject(self.filterContainer.find('[data-fkey="' + key + '"]'));

            Array.prototype.forEach.call(self.filteredItems, (v) => {
                $(v.link).css('display', 'flex');
            });
            e.update();
        },
        search: (k, evt, _this) => {
            let e = window.itemsFilter;
            let self = e.filters[k];

            e.unhide2({target: self.unhide}, k);

            let value = "";
            if (!self.searchVal) {
                value = self.searchInp.val();
            }else {
                value = self.searchVal;
            }

            self.searchVal = value;

            if (!value) {
                self.hasSearch = false;
                return;
            }

            let key = self.key || 0;

            let searchTitle = [];
            let searchDate = [];
            let searchDesc = [];
            Array.prototype.forEach.call(self.items, (elem) => {
                if (elem.title.includes(value) && (elem.key == key || key == 0 || key == '0')) searchTitle.push(elem);
                if (elem.date.includes(value) && (elem.key == key || key == 0 || key == '0')) searchDate.push(elem);
                if (elem.desc.includes(value) && (elem.key == key || key == 0 || key == '0')) searchDesc.push(elem);
            });

            if (searchTitle.length > 0) {
                self.filteredItems = searchTitle;
                self.hasSearch = true;
            }else if(searchDate.length > 0) {
                self.filteredItems = searchDate;
                self.hasSearch = true;
            }else if(searchDesc.length > 0) {
                self.filteredItems = searchDesc;
                self.hasSearch = true;
            }else {
                self.hasSearch = false;
                // hide paginator & show empty result
            }
            e.generatePages(k);
            e.filterItems2(k);
        },
        update: () => {
            let e = window.itemsFilter;

            if (Swipers.length <= 0 || window.innerWidth > mobileBreakpoint) {
                Array.prototype.forEach.call(desktopSwipers, function (v) {
                    if (v && v['length'] && v.length > 0) {
                        Array.prototype.forEach.call(v, vv => {
                            if (vv.hasOwnProperty('update')) vv.update();
                        });
                    }else {
                        if (v && v.hasOwnProperty('update')) v.update();
                    }
                });
            }else {
                Array.prototype.forEach.call(Swipers, function (v) {
                    if (v && v['length'] && v.length > 0) {
                        Array.prototype.forEach.call(v, vv => {
                            if (vv.hasOwnProperty('update')) vv.update();
                        });
                    }else {
                        if (v && v.hasOwnProperty('update')) v.update();
                    }
                });
            }
        },
        reset: () => {
          let e = window.itemsFilter;
          Array.prototype.forEach.call(e.filters, v => {
             v.filterKeys.unbind('click');
             v.select.unbind('change');
             v.select.unbind('input');

             if (v.hasPaginator) {
                 v.paginator.prevBtn.unbind('click');
                 v.paginator.nextBtn.unbind('click');
                 v.paginator.pages.unbind('click');
             }

             if (v.hasSubfilter) {
                 v.subfilterKeys.unbind('click');
             }
          });
          e.filters = [];
          e.init();
          Array.prototype.forEach.call(e.filters, (v, k) => {
              if (!v.filterContainer.hasClass('unhide')) {
                  v.filterContainer.addClass('unhide');
              }
              e.generatePagination(k);
          });
        },
        toObject: (items) => {
            if (items.hasOwnProperty('link')) return items;
            let obj = [];
            Array.prototype.forEach.call(items, (vv) => {
                vv = $(vv);
                obj.push({
                    date: vv.find('.date').text(),
                    title: vv.find('.title').text(),
                    key: vv.attr('data-fkey'),
                    desc: vv.find('.desc').text(),
                    link: vv[0]
                });
            });
            return obj;
        },
        onResize: (k) => {
            let e = window.itemsFilter;
            let self = e.filters[k];

            $(window).on('resize', function () {
                console.log(self);
                let hasGen = !!(self.paginator.dom && self.paginator.dom.length > 0);
                if (!hasGen && window.innerWidth <= mobileBreakpoint) {
                    e.unhide2({target: null}, k);
                }
            });
        }
    };

    window.mobileMenu = {
        openBtn: null,
        closeBtn: null,
        mobileMenu: null,
        orientation: null,
        orientationBreakpoint: 9000,
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
                    left = -e.orientationBreakpoint + 'px';
                    break;
                }
                case 'right': {
                    right = -e.orientationBreakpoint + 'px';
                    break;
                }
                default: {
                    e.orientation = 'left';
                    left = -e.orientationBreakpoint + 'px';
                }
            }

            let style = document.createElement('style');
            style.id = 'mobile-menu-styles';
            style.innerHTML = '.mobile-menu-slide {' +
                    'display: flex !important;' +
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
        init: () => {
            let e = window.popup;

            e.popups = $('.' + e.cl);

            if (e.popups.length <= 0) {
                return;
            }

            e.parseBool = window.helper.parseBool;

            e.parseObj = window.helper.parseObj;

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

            if (popup && popup.length <= 0) return;
            if (e.currentPopup && popup[0].id === e.currentPopup.attr('data-caller')) e.closeActive();

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
                    closeAfter: popup.attr('data-close-after') || false,
                    callerId: popup[0].id
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
                    e.replaceContainer.attr('data-caller', options.callerId);
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
                    style.innerHTML = popup.attr('data-offset') + ' {' +
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
                closeAfter: el.attr('data-close-after') || false,
                callerId: el.attr('data-caller') || false
            });
            v.remove();
            e.update();
        },
        create: (options) => {
            let e = window.popup;

            e.container.append("<div class='" + options.className + (e.parseBool(options.className) == false ? '' : ' closable') + "' id='" + options.id + "' data-caller='" + options.callerId + "' data-close-after='" + options.closeAfter + "' data-replace='" + options.replace + "' data-mm-breackpoint='" + options.mmBreackpoint + "' data-offset-type='" + options.offsetType + "' data-offset='" + options.offset + "'>" + options.html + "</div>");

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
                window.customStyles.remove('popup-target-styles__popup_content_container');
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

                if (e.currentPopup && !$('[data-popup-target="' + e.currentPopup.attr('data-caller') + '"]').hasClass('active')) {
                    e.callers.removeClass('active');
                    el.addClass('active');
                }else {
                    if (!el.hasClass('active')) {
                        e.callers.removeClass('active');
                        el.addClass('active');
                    }else {
                        el.removeClass('active');
                    }
                }

                let popupId = el.attr('data-popup-target');
                e.show(popupId);
            });

            inputsUpdate();
            phoneFieldsUpdate();
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

    let $grid = null;

    const onResizeMasonry = () => {
        if (window.innerWidth <= mobileBreakpoint) {
            if ($grid && $grid.hasOwnProperty('destroy')) {
                $grid.destroy();
            }
        }else {
            $grid = $('.audit-container').masonry({
                itemSelector: '.grid-item',
                // columnWidth: 366,
                gutter: 0,
                resize: true,
                fitWidth: true
            });
        }
    };

    $(window).on('resize', onResizeMasonry);
    onResizeMasonry();



});