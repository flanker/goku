$(function() {
  $('body').tap(function() {
    var $movieInfo = $('.movie-info');
    var height = $movieInfo.outerHeight();
    if (parseInt($movieInfo.css('bottom')) == 0) {
      $movieInfo.css('bottom', '-' + height + 'px');
    } else {
      $movieInfo.css('bottom', '0px');
    }
  });
});
