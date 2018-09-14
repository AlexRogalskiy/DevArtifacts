const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp(functions.config().firebase);

exports.sendNotifications = functions.database.ref('/winner/{winnerId}').onWrite((event) => {

  // Exit if data already created
  if (event.data.previous.val()) {
    return;
  }

  // Exit when the data is deleted
  if (!event.data.exists()) {
    return;
  }

  // Setup notification
  const WINNER_SNAPSHOT = event.data;
  const payload = {
    notification: {
      title: `Congratulations ${WINNER_SNAPSHOT.val().user}!`,
      body: WINNER_SNAPSHOT.val().message,
      icon: WINNER_SNAPSHOT.val().userProfileImg,
      click_action: `https://${functions.config().firebase.authDomain}/#/winner`
    }
  }

  return admin.database().ref('/tokens').once('value').then((data) => {

    if ( !data.val() ) return;

    const snapshot = data.val();
    const tokens = [];

    for (let key in snapshot) {
      tokens.push( snapshot[key].token );
    }

    return admin.messaging().sendToDevice(tokens, payload);
  });
});
