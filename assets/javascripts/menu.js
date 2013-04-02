Menu = {
  router: {},
  views: {}
};

Menu.views.MenuView = Backbone.View.extend({

  initialize: function () {
    this.yearSelector = ' .year-' + this.options.year + ' ';
    this.monthSelector = ' .' + this.options.month + ' ';
    this.render();
  },

  render: function () {
    this.selecteCurrent();
    this.showMonths();
    this.showBlogLinks();
  },

  selecteCurrent: function () {
    $('.archive-year, archive-month').removeClass('selected');
    $(this.yearSelector).addClass('selected');
    $(this.yearSelector + this.monthSelector).addClass('selected');
  },

  showMonths: function () {
    $('.archive-months').hide();
    $(this.yearSelector + ' .archive-months').show();
  },

  showBlogLinks: function () {
    var self = this;
    $('.current-links').fadeOut(500, function () {
      var toShow = self.yearSelector + self.monthSelector + ' .blog-links ';
      $('.current-links').html($(toShow).clone()).fadeIn(500);
    });
  }

});

Menu.router.AppRouter = Backbone.Router.extend({

  routes: {
    '!/:year/:month': 'renderLinks',
    '!/:year': 'renderYear',
    '*actions': 'empty'
  },

  renderLinks: function (year, month) {
    new Menu.views.MenuView({year: year, month: month});
  },

  renderYear: function (year) {
    var month = _(MenuData[year]).last();
    Menu.app.navigate('!/' + year + '/' + month, {trigger: true});
  },

  empty: function () {
    Menu.app.navigate('!/2013/March', {trigger: true});
  }

});

$(function () {
  Menu.app = new Menu.router.AppRouter();
  Backbone.history.start();
});
