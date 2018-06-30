class CommunityMeeting < ActiveRecord::Base
  belongs_to :creator, class_name: "User"
  belongs_to :ward

  geocoded_by :address
  after_validation :geocode
end
