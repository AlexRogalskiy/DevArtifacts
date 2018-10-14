const main = module.exports = {
    async ping () {
        const value = await this.getPong();
        return value;
    },

    async getPong() {
        return 'pong!';
    },
};