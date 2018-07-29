const __BROWSER__ = process.env.BROWSER;

const __DEVELOPMENT__ = process.env.NODE_ENV !== 'production';

const __PORT__ = process.env.PORT || 3000;

const __PRODUCTION__ = process.env.NODE_ENV === 'production';

const __VERSION__ = process.env.version || '0.0.1';


export {
  __BROWSER__,
  __DEVELOPMENT__,
  __PORT__,
  __PRODUCTION__,
  __VERSION__,
};
