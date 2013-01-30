$(function () {

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

  $('.folding-fan .timeline-tag').each(function () {
    var index = $(this).data('index');
    var degree = indexDegreeMap[index].degree;

    $(this).css('z-index', indexDegreeMap[index].z);
    this.style.webkitTransform = "rotate(" + degree + ")";
  });

  $('.folding-fan .timeline-tag').click(function () {
    var selected = $(this).data('index');

    $('.folding-fan .timeline-tag').each(function () {
      var index = $(this).data('index');
      var newIndex = (index - selected + 8) % 8;
      var degree = indexDegreeMap[newIndex].degree;

      $(this).css('z-index', indexDegreeMap[newIndex].z);
      $(this).data('index', newIndex);
      this.style.webkitTransform = "rotate(" + degree + ")";
    });
  });

});