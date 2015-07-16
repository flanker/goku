$(function() {
  var $movieInfo = $('.movie-info');
  var $nav = $('.nav');
  var $dots = $('.dots');
  var height = $movieInfo.outerHeight();

  setTimeout(function () {
    $movieInfo.css('bottom', '0px');
    $nav.css('top', '5px');
    $dots.css('top', '5px');
  }, 500)

  $('body').tap(function (e) {
    if (parseInt($movieInfo.css('bottom')) == 0) {
      $movieInfo.css('bottom', '-' + height + 'px');
      $nav.css('top', '-20px');
      $dots.css('top', '-20px');
    } else {
      $movieInfo.css('bottom', '0px');
      $nav.css('top', '5px');
      $dots.css('top', '5px');
    }
  }).doubletap(function (e) {
    e.preventDefault();
  }).scrollstart(function (e) {
    e.preventDefault();
  });

  $(".swipe-show").swipeshow({
    autostart: false,
    interval: 4000,
    speed: 700,
    friction: 0.3,
    $dots: $('div.dots')
  });

  $('.video a').click(function (e) {
    $('.video img').hide();
    $('.video a').hide();
    $('.video video').show()[0].play();
    e.preventDefault();
  });
});
