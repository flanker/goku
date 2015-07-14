$(function() {
  var $movieInfo = $('.movie-info');
  var height = $movieInfo.outerHeight();

  setTimeout(function() {
    $movieInfo.css('bottom', '0px');
  }, 500)

  setTimeout(function() {
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
  }).swiperight(function (e) {
    $('.poster').append('swipe right; ')
  }).swipeleft(function (e) {
    $('.poster').append('swipe left; ')
  }).scrollstart(function (e) {
    e.preventDefault();
  });
});
