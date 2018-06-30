class MeetingAttendance < ActiveRecord::Base
  belongs_to :user
  belongs_to :community_meeting
end
