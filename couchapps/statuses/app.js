var couchapp = require('couchapp');
var path = require('path');
  ddoc = {
      _id: '_design/app'
    , views: {}
    , lists: {}
    , shows: {}
  }

  module.exports = ddoc;

  ddoc.language = "javascript";
  ddoc.rewrites = [
      {from:"/", to:'index.html'}
    , {from:"/api", to:'../../'}
    , {from:"/api/*", to:'../../*'}
    , {from:"/*", to:'*'}
    ];

/** add views/shows/lists below **/
  ddoc.views.byType = {
    map: function(doc) {
      emit(doc.type, null);
    },
    reduce: '_count'
  }
ddoc.views.messages = {
  map: function(doc) {
    emit( doc.type, { title: doc.title, description: doc.description } ) 
  }
}
couchapp.loadAttachments(ddoc, path.join(__dirname, 'html'));
