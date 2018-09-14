# vuejs-meetup-pwa

> A quick project to show how to use Firebase messaging with Vue.js

This project uses VueFire to connect with Firebase and also Vuex.

For the purpose of the talk this example was developed for, the store fetches some data from Meetup.com's API.

## Before running

You need to create the file `src/config.js` with this structure:
```javascript
const firebaseConfig = {
  apiKey: 'YOUR API KEY HERE',
  authDomain: 'AGAIN',
  databaseURL: 'UHUM',
  projectId: 'AAAAH',
  storageBucket: '666',
  messagingSenderId: 'SK8ERBOY',
};

const meetupKey = 'YOUR API KEY HERE';

export { firebaseConfig, meetupKey };

```

## Extra information

Vue-CLI's PWA template uses sw-precache to serve the final Service Worker file. To be able to use FCM I had to swith to [serviceworker-webpack-plugin](https://github.com/goldhand/sw-precache-webpack-plugin) to make it work and test it.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
