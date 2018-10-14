const console = require('better-console');
const yargs = require('yargs').argv;

module.exports = (bin, { clear = true, json = true, exit = false } = {}) => {
    const filename = getCallerFilename();
    if(!filename.endsWith(yargs.$0))
        return;

    const endpoint = yargs._[0];
    const args = yargs;

    delete args.$0;
    delete args._;
    delete args.version;
    delete args.help;

    const run = async (bin, endpoint, args) => {
        if(clear)
            console.clear();

        console.warn(`Executing: ${endpoint}`);
        console.warn(`Arguments: ${JSON.stringify(args, null, 4)}`)

        try {
            const result = await bin[endpoint](args);
            if(json)
                console.info(JSON.stringify(result, null, 4));
            else
                console.info(result);
        }
        catch(error) {
            console.error('Failure:', error);
        }
    };

    const fire = endpoint && process.argv[0].endsWith('node');

    if(fire)
        run(bin, endpoint, args).then(result => exit && process.exit());
};

const getCallerFilename = () => {
    const originalFunction = Error.prepareStackTrace;

    let callerFilename;

    try {
        const error = new Error();
        let currentFilename;

        Error.prepareStackTrace = (error, stack) => stack;

        currentFilename = error.stack.shift().getFileName();

        while (error.stack.length) {
            callerFilename = error.stack.shift().getFileName();
            if(currentFilename !== callerFilename)
                break;
        }
    }
    catch (error) {
        () => {};
    }

    Error.prepareStackTrace = originalFunction;

    return callerFilename;
};