/*
 this bind's to res object from routes
*/
module.exports = {
  buildGetResponse: function (data) {
    var result = {
        data: data,
        count: data.length,
        status: 'success'
    }

    this.status(200).json(result);
  },

  buildCreateResponse: function (data) {
    var result = {
        data: data,
        status: 'success'
    }

    this.status(201).json(result);
  },

  buildErrorResponse: function (err) {
    var error = {
        name: err.name,
        message: err.message,
        errors: err.errors
    }

    this.status(500).json(error);
  }
}