import template from './start.html';

const start = {
  template,
  controllerAs: 'ctrl',
  controller: class StartCtrl {

    constructor($mdSidenav, $window) {
      'ngInject';
      this.$mdSidenav = $mdSidenav;
      this.$window    = $window;
    }

    $onInit() {
      this.$window.document.title = 'Snack';
    }

    toggleSidebar () {
      this.$mdSidenav('left').toggle();
    }
  }
};

export { start };
