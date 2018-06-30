class LegislationSponsor < ActiveRecord::Base
  belongs_to :legislation
  belongs_to :legislator, foreign_key: :sponsor_id
end
