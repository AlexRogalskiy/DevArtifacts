function loadPhotos(){
        var callback = "displayPhotos";
        $.ajax({
          url: 'https://api.flickr.com/services/feeds/photos_public.gne' +
               '?format=json' +
               '&jsoncallback=' + callback,
          dataType: "jsonp"
        })
      }
      function displayPhotos(data){
        $.each(data.items, function(i,item){
          var $imageTag = $('<img>');
          $imageTag.attr('src', item.media.m);
          $('body').append($imageTag);
        });
      }
      loadPhotos();