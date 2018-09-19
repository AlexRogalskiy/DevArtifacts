/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'tracker',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    contentSecurityPolicy: {
      'default-src': "'self'",
      // Allow scripts from live reload
      'script-src': "'self' ws://localhost:49152",
      // Add external font uri
      'font-src': "'self'",
      // Allow data (ajax/websocket) from course api https://bnr-tracker-api.herokuapp.com
      // Allow scripts from live reload
      'connect-src': "'self' https://bnr-tracker-api.herokuapp.com ws://localhost:49152",
      // Allow images from the origin itself (i.e. current domain)
      'img-src': "'self'",
      // Allow inline styles
      'style-src': "'self' 'unsafe-inline'",
      // `media-src` will be omitted from policy
      // Browser will fallback to default-src for media resources (which is to deny, see above).
      'media-src': null
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-cli-mirage'] = {
      enabled: false
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
