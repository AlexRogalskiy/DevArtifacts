class LegislationVoice < ActiveRecord::Base
  belongs_to :user
  belongs_to :legislation
end
