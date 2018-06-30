class ChangeCommunityMeetingDateTime < ActiveRecord::Migration
  def change
		remove_column :community_meetings, :time_at
		add_column :community_meetings, :date_at, :datetime
		add_column :community_meetings, :start_at, :time
		add_column :community_meetings, :end_at, :time
  end
end
