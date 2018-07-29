/**
 * Local variables
 */
const env = process.env;

const config = {};

/**
 * Configuration
 */
config.browser = env.BROWSER || false;
config.env = env.NODE_ENV || 'development';
config.name = env.NAME || 'Andy Tran';
config.port = env.PORT || 3000;
config.social = {};
config.social.dribbble = env.DRIBBBLE || 'helloandytran';
config.social.github = env.GITHUB || 'andyhqtran';
config.social.facebook = env.FACEBOOK || 'itsandytran';
config.social.instagram = env.INSTAGRAM || 'helloandytran';
config.social.linkedin = env.LINKEDIN || 'andyhqtran';
config.social.twitter = env.TWITTER || 'helloandytran';
config.type = env.TYPE || 0;
config.username = env.USERNAME || 'andytran';
config.version = env.VERSION || '0.0.1';

export default config;
