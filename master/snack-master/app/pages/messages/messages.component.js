import firebase from 'firebase';
import template from './messages.html';

const messages = {
  template,
  bindings: {
    channelRef: '<',
    messagesCollection: '<'
  },
  controllerAs: 'ctrl',
  controller: class MessagesCtrl {

    constructor($scope, $window, $mdSidenav, UserService) {
      'ngInject';

      this.$mdSidenav  = $mdSidenav;
      this.$scope      = $scope;
      this.$window     = $window;
      this.db          = firebase.firestore();
      this.loading     = true;
      this.message     = { body: '' };
      this.messages    = [];
      this.UserService = UserService;
    }

    $onInit() {
      this.channelRef.get().then((querySnapshot) => {
        this.channel = querySnapshot.data();
        this.$window.document.title = `Snack #${this.channel.name}`;
        this.$scope.$apply();
      });

      this.messagesCollection
        .where('channel', '==', this.channelRef)
        .onSnapshot((querySnapshot) => {
          this.loading = false;
          this.$scope.$apply();
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            data.user.get().then((user) => {
              const message = {
                ...doc.data(),
                ...user.data(),
                uid: user.id,
                id: doc.id
              };
              const index = this.messages.findIndex(({id}) => id === doc.id);
              if (index === -1) {
                this.messages.push(message);
                this.$scope.$apply();
              }
            });
          });
        });
    }

    sendMessage ({
      body      = 'has nothing to say',
      timestamp = firebase.firestore.FieldValue.serverTimestamp(),
      user      = this.db.doc(`users/${this.UserService.user.uid}`),
      channel   = this.channelRef
    }) {
      this.message.body = '';
      this.messagesCollection.add({
        body,
        timestamp,
        user,
        channel
      });
    }

    toggleSidebar () {
      this.$mdSidenav('left').toggle();
    }
  }
};

export { messages };
