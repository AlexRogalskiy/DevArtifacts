module.exports = {
    create: function () {
        return function (result) {
            var envelope = {};
            envelope.items = result;
            return envelope;
        }
    }
};