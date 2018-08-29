App.MenuViewShadow = Ember.View.extend({
  tagName: 'div',
  classNames: ['app-menu-shadow'],
  classNameBindings: ['controller.controllers.editor.device.platform'],
  urlBinding: 'controller.target.location.lastSetURL',

  attributeBindings: ['style'],

  style: function() {
    var style = "";
    // Hide menu if not selected
    var hideMenu = true;
    var currentRoute = this.get('url');
    if(currentRoute) {
        var splittedPath = currentRoute.split('/');
        var selectedType = splittedPath[splittedPath.get('length') - 2];
        if(selectedType === 'menu' || selectedType === 'menuItem') {
            hideMenu = false;
        }
    }
    if(hideMenu) {
        style += "display:none";
    }

    return style;
  }.property(
    'url'
    )

});
