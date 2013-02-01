var isWindowTooSmall = function () {
    return $(window).width() < 569;
  };

$(function () {

  if ($('.home').length === 0) return;

  if (isWindowTooSmall()) return;

  var indexDegreeMap = {
    0: {degree: '0deg', z: 1000},
    1: {degree: '10deg', z: 950},
    2: {degree: '20deg', z: 900},
    3: {degree: '30deg', z: 850},
    4: {degree: '40deg', z: 800},
    5: {degree: '-30deg', z: 850},
    6: {degree: '-20deg', z: 900},
    7: {degree: '-10deg', z: 950}
  };

  var targetTop = $(".timeline-inner").offset().top + 10;
  var toInit = true;

  var initFoldingFan = function () {
    toInit = false;

    $('.folding-fan .timeline-tag').each(function () {
      var $this = $(this);
      var index = $this.data('index');
      var degree = indexDegreeMap[index].degree;

      $this.css({
        '-webkit-transform': 'rotate(' + degree + ')',
        '-moz-transform': 'rotate(' + degree + ')',
        'ms-transform': 'rotate(' + degree + ')',
        'z-index': indexDegreeMap[index].z
      });
    });
  };

  if ($(window).height() > targetTop) {
    initFoldingFan();
  }

  $(window).scroll(function(){
    if (isWindowTooSmall()) return;

    var scrollYpos = $(document).scrollTop();

    if (toInit && scrollYpos + $(window).height() > targetTop ) {
      initFoldingFan();
    }
  });

  $('.folding-fan .timeline-tag').click(function () {
    if (isWindowTooSmall()) return;

    var selected = $(this).data('index');

    $('.folding-fan .timeline-tag').each(function () {
      var $this = $(this);
      var index = $this.data('index');
      var newIndex = (index - selected + 8) % 8;
      var degree = indexDegreeMap[newIndex].degree;

      $this.data('index', newIndex);
      $this.css({
        '-webkit-transform': 'rotate(' + degree + ')',
        '-moz-transform': 'rotate(' + degree + ')',
        'ms-transform': 'rotate(' + degree + ')',
        'z-index': indexDegreeMap[newIndex].z
      });
    });
  });

});