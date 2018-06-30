class CreateMeetingAttendances < ActiveRecord::Migration
  def change
    create_table :meeting_attendances do |t|
      t.belongs_to :user, index: true
      t.belongs_to :community_meeting, index: true

      t.timestamps
    end
  end
end
