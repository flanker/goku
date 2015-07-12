$(function() {
  var $movieInfo = $('.movie-info');
  var height = $movieInfo.outerHeight();
  setTimeout(function() {
    $movieInfo.css('bottom', '0px');
  }, 500)

  $('body').tap(function() {
    if (parseInt($movieInfo.css('bottom')) == 0) {
      $movieInfo.css('bottom', '-' + height + 'px');
    } else {
      $movieInfo.css('bottom', '0px');
    }
  });

  $('body').on('touchmove', function (event) {
    event.preventDefault();
  }, false);
});
