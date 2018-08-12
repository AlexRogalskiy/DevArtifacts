import firebase from 'firebase';
import template from './app.html';

export const AppComponent = {
  template,
  controllerAs: 'ctrl',
  controller: class AppController {

    constructor($state, $stateParams, $scope, $mdDialog, $mdSidenav, $firebaseAuth, UserService) {
      'ngInject';

      this.$mdDialog    = $mdDialog;
      this.$mdSidenav   = $mdSidenav;
      this.$scope       = $scope;
      this.$state       = $state;
      this.$stateParams = $stateParams;
      this.channels     = [];
      this.db           = firebase.firestore();
      this.loading      = true;
      this.signIn       = UserService.signIn;
      this.signOut      = UserService.signOut;
      this.user         = UserService.user;
    }

    $onInit() {
      this.db.collection('channels').onSnapshot((querySnapshot) => {
        this.loading = false;
        this.channels = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          this.channels.push({
            id: doc.id,
            ...data
          });
        });
        this.$scope.$apply();
      });
    }

    addChannel(ev) {
      const prompt = this.$mdDialog.prompt({
        title: 'What would you name your channel?',
        textContent: 'Something vigorous.',
        placeholder: 'Channel name',
        ariaLabel: 'Channel name',
        targetEvent: ev,
        ok: 'Create',
        cancel: 'Cancel'
      });

      this.$mdDialog.show(prompt)
        .then((name) => this.db.collection('channels').add({
          name,
          creator: this.db.doc(`users/${this.user.uid}`),
          members: [
            this.db.doc(`users/${this.user.uid}`)
          ]
        }));
    }

    openMessages(channelId, locked) {
      if (!locked) {
        this.toggleSidebar();
      }
      this.$state.go('messages', { channelId });
    }

    openMenu($mdMenu, ev) {
      $mdMenu.open(ev);
    }

    toggleSidebar () {
      this.$mdSidenav('left').toggle();
    }
  }
};
