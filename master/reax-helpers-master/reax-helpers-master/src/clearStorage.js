export default ({ debug } = {}) => {
    try {
        const script = document.querySelector('script[src*=app]').src;

        const currentBundleHash = script.includes('?') ?
            script.match(/\?(.+?)$/)[1] :
            script.match(/\.(.{10,})\.min/)[1];

        const previousBundleHash = localStorage.bundleHash;
        if(previousBundleHash != currentBundleHash) {
            if(debug)
                console.log('Clearing localStorage', previousBundleHash, '=>', currentBundleHash);
            localStorage.clear();
            localStorage.setItem('bundleHash', currentBundleHash);
        }
        else {
            if(debug)
                console.log('Preserving localStorage', currentBundleHash);
        }
    }
    catch(error) {
        console.error('clearStorage', error);
    }
};
