import firebase from 'firebase';


function UserService ($firebaseAuth) {
  'ngInject';
  const $auth = $firebaseAuth();
  const auth  = firebase.auth();
  const db    = firebase.firestore();
  var pending = true;
  var user    = {};

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUser(user);      
    }
    pending = false;
  });

  const signIn = () => $auth.$signInWithPopup('google')
    .then(({user}) => setUser(user))
    .catch(()      => setUser({}));

  const signOut = () => {
    $auth.$signOut();
    setUser({});
  };

  const setUser = ({
    uid = null,
    email = null,
    photoURL = null,
    displayName = null
  }) => {
    Object.assign(user, {
      uid,
      email,
      photoURL,
      displayName
    });
    if (uid) {
      db.collection('users').doc(uid).set({
        email,
        photoURL,
        displayName
      });
    }
  };

  return {
    pending,
    signIn,
    signOut,
    user
  };

}

export { UserService };