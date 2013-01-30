$(function () {

  if ($(window).width() < 569) {
    return;
  }

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

  var targetTop = $(".timeline-inner").offset().top;
  var init = true;

  $(window).scroll(function(){

    var windowHeight = $(window).height();
    var scrollYpos = $(document).scrollTop();

    if (init && scrollYpos + windowHeight > targetTop ) {
      init = false;

      $('.folding-fan .timeline-tag').each(function () {
        var $this = $(this);
        var index = $this.data('index');
        var degree = indexDegreeMap[index].degree;

        $this.css({
          '-webkit-transform': 'rotate(' + degree + ')',
          '-moz-transform': 'rotate(' + degree + ')',
          'z-index': indexDegreeMap[index].z
        });
      });
    }
  });

  $('.folding-fan .timeline-tag').click(function () {
    if ($(window).width() < 569) {
      return;
    }
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
        'z-index': indexDegreeMap[newIndex].z
      });
    });
  });

});