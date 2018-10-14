const pkg = require('./package.json');

const console = require('better-console');
const fs = require('fs');
const http = require('http');
const https = require('https');
const koa = require('koa');
const cors = require('kcors');
const compress = require('koa-compress');
const noTrailingSlash = require('koa-no-trailing-slash');
const rateLimit = require('koa-ratelimit');
const json = require('koa-json');
const body = require('koa-body');
const send = require('koa-send');
const mount = require('koa-mount');
const auth = require('koa-basic-auth');
const sslify = require('koa-sslify');
const userAgent = require('koa-useragent');
const puppeteer = require('puppeteer');
const scheduler = require('node-schedule');

const router = require('koa-router')();

const redis = pkg.redis ? require('./api/redis') : null;
const APIs = require('./api');
const jobs = require('./api/jobs');

const app = new koa();

app.use(cors());
app.use(compress());
app.use(noTrailingSlash());
app.use(json({ pretty: true, spaces: 4 }));
app.use(body({ formLimit: '1mb', jsonLimit: '1mb', strict: false, multipart: true }));
app.use(userAgent);

if(redis) {
    app.use(rateLimit({
        db: redis,
        duration: 60000,
        max: 500,
        id: ctx => ctx.ip,
    }));
}

const hostConfig = pkg.host[process.env.NODE_ENV] || pkg.host;
const sslConfig = pkg.ssl ? (pkg.ssl || pkg.ssl[process.env.NODE_ENV]) : null;

if(sslConfig) {
    app.use(sslify({
        hostname: hostConfig.hostname,
        port: hostConfig.httpsPort || 443,
        redirectMethods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
    }));
}

app.use(async (ctx, next) => {
    try {
        await next();
    }
    catch(error) {
        if (error.status === 401) {
            ctx.status = 401;
            ctx.set('WWW-Authenticate', 'Basic');
            ctx.body = 'Unauthorized.';
        }
        else {
            console.error(error);
            ctx.status = 400;
            ctx.body = error.message || error;
        }
    }
});

for(const mountPoint in APIs) {
    const API = APIs[mountPoint];
    router.all(`/api/${mountPoint}/:action`, async ctx => {
        const { action } = ctx.params;
        const args = { ...ctx.request.query, ...ctx.request.body };
        ctx.body = await API[action](args);
    });
}

const cacheHeaders = (res, path, stats) => {
    res.setHeader('Cache-Control', 'max-age=' + 3600 * 24 * 7);
};

router.all(['/build/*', '/assets/*'], async ctx => {
    await send(ctx, ctx.path, { root: __dirname, setHeaders: cacheHeaders });
});

const render = async (url, ttl = 3600, bot, identifier, secret) => {
    console.info('rendering', url, bot);

    if(redis) {
        const content = await redis.get(url);
        if(!content)
            console.warn('cache miss', url);
        else {
            console.info('cache hit', url);
            return content;
        }
    }

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    if(identifier && secret)
        await page.authenticate({ username: identifier, password: secret });
    await page.goto(url + (!url.includes('?') && '?' || '&') + 'prerender=1', { waitUntil: 'networkidle0' });
    const content = await page.content();
    await browser.close();

    if(redis) {
        await redis.set(url, content, 'EX', ttl);
    }

    return content;
};

//let "/" bundle to be the let in order so it does not prevail on others
const bundles = pkg.bundles.filter(bundle => bundle.baseRoute).sort((a, b) => a.baseRoute.length <= b.baseRoute.length);

for(const bundle of bundles) {
    const { name, baseRoute, htmlOutputFilename, noIndex, prerender, ttl, identifier, secret } = bundle;

    if(identifier && secret)
        app.use(mount(baseRoute, auth({ name: identifier, pass: secret })));

    router.all([baseRoute, `${baseRoute !== '/' ? baseRoute : ''}/*`], async ctx => {
        const { protocol, host, url: pathname, userAgent: { isBot } } = ctx;
        const url = `${protocol}://${host}${pathname}`;

        if(isBot && noIndex)
            ctx.body = 'User-agent: *\nDisallow: /';
        else if(prerender && !ctx.request.query.prerender)
            ctx.body = await render(url, ttl, isBot, identifier, secret);
        else
            await send(ctx, htmlOutputFilename || `./build/${name}/index.html`, { root: __dirname, setHeaders: cacheHeaders });
    });
}

app.use(router.routes());

http.createServer(app.callback()).listen(hostConfig.httpPort || 80);

if(sslConfig) {
    const sslOptions = {
        key: fs.readFileSync(sslConfig.key),
        cert: fs.readFileSync(sslConfig.cert),
    };
    https.createServer(sslOptions, app.callback()).listen(hostConfig.httpsPort || 443);
}

if(process.env.pm_id === '0')
    for(const time in jobs)
        scheduler.scheduleJob(time, jobs[time]);