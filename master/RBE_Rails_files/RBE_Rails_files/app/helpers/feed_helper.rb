module FeedHelper

  AUTHOR      = 'Kevin C. Baird'
  
  DESCRIPTION = %q{Photos from Jenn and Kevin's Wedding}
  
  ICON        = {
    :url    => 'rails.png',
    :width  => 77,
    :height => 69,
  }

  LANGUAGE    = 'en-us'

  LINK_OPTIONS_DEFAULTS = { 
      :only_path  => false,
      :controller => 'album',
  }

  LINK_OPTIONS = {
    :index => LINK_OPTIONS_DEFAULTS.merge( { :action => 'index' } ),
    :show  => LINK_OPTIONS_DEFAULTS.merge( { :action => 'show'  } ),
  }

  RSS_OPTIONS = {
    'version'  => '2.0', 
    'xmlns:dc' => 'http://purl.org/dc/elements/1.1/'
  }

  TITLE       = 'Baird/Cornish Wedding Photos'

  def feed_description()
    h( DESCRIPTION )
  end

  def rss_url_for_image(image)
    return url_for( FeedHelper::LINK_OPTIONS[:index] ) unless image
    url_for( FeedHelper::LINK_OPTIONS[:show].merge( { :id => image } ) )
  end

end
