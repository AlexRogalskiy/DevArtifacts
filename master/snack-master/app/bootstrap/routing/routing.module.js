import firebase from 'firebase';


const channelRef = ($stateParams) => {
  'ngInject';
  return firebase.firestore().doc(`channels/${$stateParams.channelId}`);
};

const messagesCollection = () => firebase.firestore().collection('messages');

export const RoutingModule = angular
  .module('routing', [
    'ui.router',
    'ngSanitize'
  ])
  .config((
    $stateProvider,
    $urlRouterProvider,
    $locationProvider
  ) => {
    'ngInject';

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false,
      rewriteLinks: false
    });


    $urlRouterProvider.otherwise('/');
    $stateProvider
      .state('start', {
        url: '/',
        component: 'start',
        resolve: {
        }
      })
      .state('messages', {
        url: '/messages/:channelId',
        component: 'messages' ,
        resolve: {
          channelRef,
          messagesCollection
        }
      });
  })
  .run(($state, $mdDialog) => {
    'ngInject';

    $state.defaultErrorHandler(function(error) {
      const errorDialog = $mdDialog.alert()
        .title(error.message)
        .textContent(error.detail)
        .ok('OK');
      $mdDialog.show(errorDialog);
    });
  })
  .name;
