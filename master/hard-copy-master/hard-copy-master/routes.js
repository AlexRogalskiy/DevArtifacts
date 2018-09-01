define(['controllers/indexcontroller'], function(indexController) {
    return [
        ["/", indexController.index]
    ];
});