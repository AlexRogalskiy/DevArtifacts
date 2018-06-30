# ImagesLoadedRails

asset pipeline wrapper for imagesLoaded.js - Detect when images have been loaded.


## Installation

Add this line to your application's Gemfile:

    gem 'imagesLoaded_rails'

and add to application.js manifest

    //= require imagesloaded

And then execute:

    $ bundle

Or install it yourself as:

    $ gem install imagesLoaded_rails

## Usage


    imagesLoaded( elem, callback )

and in jQuery

    $('#container').imagesLoaded( function() {
      // images have loaded
    });

see https://github.com/desandro/imagesloaded for more info

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
