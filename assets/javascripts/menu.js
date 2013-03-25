Menu = {
  router: {},
  views: {}
};

Menu.views.MenuView = Backbone.View.extend({

  initialize: function () {
    this.year = this.options.year;
    this.month = this.options.month;
    this.render();
  },

  render: function () {
    $('.archive-months').hide();
    $('.archive-year.' + this.year + ' .archive-months').show();

    var self = this;
    $('.current-links').fadeOut(500, function () {
      var toShow = '.' + self.year + ' .' + self.month + ' .blog-links';
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
