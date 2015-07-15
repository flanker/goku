$(function() {
  var $movieInfo = $('.movie-info');
  var height = $movieInfo.outerHeight();

  setTimeout(function () {
    $movieInfo.css('bottom', '0px');
  }, 500)

  setTimeout(function () {
    $('.swipe-hint').fadeOut(1000);
  }, 4000)

  $('body').tapstart(function () {
    $('.swipe-hint').fadeOut(300);
  }).tap(function (e) {
    if (parseInt($movieInfo.css('bottom')) == 0) {
      $movieInfo.css('bottom', '-' + height + 'px');
    } else {
      $movieInfo.css('bottom', '0px');
    }
  }).scrollstart(function (e) {
    e.preventDefault();
  });

  $(function() {
    $(".swipe-show").swipeshow({
      autostart: false,
      interval: 4000,
      speed: 700,
      friction: 0.3,
    });
  });

  $('.video a').click(function (e) {
    $('.video img').hide();
    $('.video a').hide();
    $('.video video').show()[0].play();
    e.preventDefault();
  });
});
