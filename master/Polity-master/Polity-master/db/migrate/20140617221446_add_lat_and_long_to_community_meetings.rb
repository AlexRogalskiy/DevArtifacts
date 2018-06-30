class AddLatAndLongToCommunityMeetings < ActiveRecord::Migration
  def change
  	add_column :community_meetings, :latitude, :float
  	add_column :community_meetings, :longitude, :float
  end
end
