$(function () {

    let mobileMenu = reRenderMobileMneu($('.mobile-menu'));

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

    $('.mobile-menu-btn,.close-menu-btn').on('click', function() {
        toggleMenu(mobileMenu, this);
    });

});