// mobile menu
const menuHamburgerButton = document.querySelector('.menu-btn');
const blockMenu = document.querySelector('.menu');

menuHamburgerButton.addEventListener( 'click', function(){
    this.classList.toggle('active');
    blockMenu.classList.toggle('active');
});
// end

// get button scroll-top
const buttonScrollTop = $("#scroll-top");

// the appearance of the scroll button to the top of the page when scrolling
$(window).scroll(function(){
    const positionTopWindow = $(window).scrollTop();
    if( positionTopWindow > 500 ){
        buttonScrollTop.addClass('visible');
    }else{
        buttonScrollTop.removeClass('visible');
    }
});

// slow scroll top page
buttonScrollTop.on("click", function () {
    $("html, body").animate({
        scrollTop: $("body").offset().top
    });

    return false;
});
// end

// libs select2 init
    $(document).ready(function() {
        $('.js-example-basic-single').select2({
            placeholder: 'Выберите тип системы',
            width: 'style',
            minimumResultsForSearch: -1
        });
    });
// end

// scrollbar - output of the value in span
$(document).on('input', '#scrollbar__input', function() {
    $('#scrollbar__value').html( $(this).val() + ' %' );
});
// end

// input type file - 
$('.file input[type=file]').on('change', function(){
	const file = this.files[0];
	$('#file__value').html(file.name);
    $('.file label').addClass('valid');
});
// end