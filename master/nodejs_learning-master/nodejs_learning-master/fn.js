module.exports = function(req, res) {
    res.end('hello');
    console.log(req.url);
};