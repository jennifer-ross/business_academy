$(function () {

    // let mobileMenu = reRenderMobileMneu($('.mobile-menu'));

    function reRenderMobileMneu(mobileMenu) {
        let mobileMenuVal = mobileMenu[0].innerHTML;
        let mMenu = document.createElement('div');
        mMenu.className = 'mobile-menu';
        mMenu.innerHTML = mobileMenuVal;
        document.body.append(mMenu);
        mobileMenu.remove();
        return $('.mobile-menu');
    }

    function toggleMenu(el) {
        let menu = $(el);
        let html = $('html');
        let mBtn = $('.mobile-menu-btn .animated-icon');
        if (menu.css('right') >= '0px' || menu.css('right') >= 0) {
            menu.animate({right: '-9999px'});
            mBtn.removeClass('open');
            html.removeClass('no-scroll');
        }else {
            menu.animate({right: '0'});
            mBtn.addClass('open');
            html.addClass('no-scroll');
        }
    }

    let productDetailSwiper = new Swiper('.swiper-container', {
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
        slidesPerGroup: 1,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        },
    });

    let reviewsSwiper = new Swiper('.swiper-container-reviews', {
        spaceBetween: 20,
        direction: 'horizontal',
        autoHeight: !0,
        loop: !1,
        centeredSlides: false,
        // freeMode: false,
        slidesPerView: 5,
        spaceBetween: 30,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
        }
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

    let sertificatsSwiper = new Swiper('.swiper-container-sertificat', {
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
    window.submenu.init();

});