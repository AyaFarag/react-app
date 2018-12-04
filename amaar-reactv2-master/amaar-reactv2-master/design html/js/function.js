$(document).ready(function () {
    $('.your-class').slick({
        lazyLoad: 'ondemand',
        centerMode: false,
        centerPadding: '60px',
        slidesToScroll: 1,

        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 4,
        responsive: [{
            breakpoint: 1200,
            settings: {
                arrows: false,
                centerMode: false,
                centerPadding: '40px',
                slidesToShow: 2
            }
        }, {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: false,
                centerPadding: '40px',
                slidesToShow: 1
            }
        }]
    });

    $('.amarSectionSlide').slick({
        lazyLoad: 'ondemand',
        centerMode: false,
        centerPadding: '60px',
        slidesToScroll: 1,

        autoplay: true,
        autoplaySpeed: 2000,
        slidesToShow: 2,
        responsive: [{
            breakpoint: 1200,
            settings: {
                arrows: false,
                centerMode: false,
                centerPadding: '40px',
                slidesToShow: 2
            }
        }, {
            breakpoint: 480,
            settings: {
                arrows: false,
                centerMode: false,
                centerPadding: '40px',
                slidesToShow: 1
            }
        }]
    });
    window.onscroll = function () {
        myFunction()
    };
    var navbar = document.getElementById("header");
    var sticky = navbar.offsetTop;

    function myFunction() {
        if (window.pageYOffset > sticky) {
            navbar.classList.add("sticky")
        } else {
            navbar.classList.remove("sticky");
        }
    }
});

var sections = $('.scrolleffect')
    , nav = $('header')

    , nav_height = nav.outerHeight();
$(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop();

    sections.each(function () {
        var top = $(this).offset().top - nav_height,
            bottom = top + $(this).outerHeight();

        if (cur_pos >= top && cur_pos <= bottom) {
            nav.find('a').removeClass('activeForA');
            nav.find('a').addClass('activeForAhidden');
            nav.find('a[href="#' + $(this).attr('id') + '"]').addClass('activeForA').removeClass('activeForAhidden');
        }
    });
});

nav.find('a').on('click', function () {
    var $el = $(this), id = $el.attr('href');
    $('html, body').animate({

        scrollTop: $(id).offset().top - nav_height
    }, 500);

    return false;
});

function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}

$('.search select').each(function () {

    $(this).change(
        function () {
            $(this).css("color", "#e58100");
        });
});