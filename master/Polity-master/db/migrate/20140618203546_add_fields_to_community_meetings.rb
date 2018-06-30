class AddFieldsToCommunityMeetings < ActiveRecord::Migration
  def change
    add_column :community_meetings, :description, :text
    add_column :community_meetings, :city, :string, :default => "Chicago"
    add_column :community_meetings, :state, :string, :default => "IL"
  end
end
