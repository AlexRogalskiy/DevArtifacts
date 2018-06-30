class ChangeCommunityMeetingDateTimeToDate < ActiveRecord::Migration
  def change
		change_column :community_meetings, :date_at, :date
  end
end
