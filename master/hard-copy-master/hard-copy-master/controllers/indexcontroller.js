define(function() {

    return {
        index: {
            get: function(request, response) {
                response.render("index", {test: "In the controller"});
            }
        }
    };

});