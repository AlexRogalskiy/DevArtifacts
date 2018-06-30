class LegislatorVote < ActiveRecord::Base
  belongs_to :legislation
  belongs_to :legislator

  def ward_support_percent(ward_id)
    (((self.legislation).ward_legislation_support(ward_id).to_f/(self.legislation).ward_legislation_voices(ward_id).to_f).round(2) * 100).floor
  end

  def ward_opposition_percent(ward_id)
    100 - ward_support_percent(ward_id)
  end
end
