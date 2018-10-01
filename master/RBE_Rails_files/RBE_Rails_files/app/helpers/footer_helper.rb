module FooterHelper

  BAR_SEPARATOR = %q[ | ]
  
  RSS = {
    
    :icons => %w[feed-icon16x16.png xmlicon.png],

    :link_options => {
      :action     => %q[images],
		  :controller => %q[feed],
    }

	}
  
  def show_footer()
    '<p id="rails_img_wrapper">' + 
    [rails_link_to_top, rss_icon_links].join(
      ApplicationHelper::HTML_BREAK
    ) + '</p>'
  end

  private

  def rails_link_to_top()
		link_to(
      image_tag(
        'rails.png', 
        :alt    => 'Home', 
        :border => 0, 
        :id     => 'rails_img', 
        :style  => AlbumHelper::IMAGE_STYLE[:base]
      ), :controller => 'album' 
    )
  end

  def rss_icon_links()
    RSS[:icons].map do |icon|
      link_to(
			  image_tag(
          icon, 
          :alt   => 'RSS Feed', 
          :class => 'xmlicon'
        ), RSS[:link_options]
      )
    end.join(BAR_SEPARATOR)
  end

end
