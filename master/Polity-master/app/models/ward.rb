class Ward < ActiveRecord::Base
  has_one :legislator, foreign_key: :alderman_id #not sure if this is right?
  has_many :user_addresses
  has_many :users, through: :user_addresses
  has_many :community_meetings

  def citizens
    addresses_in_ward = UserAddress.where(ward_id: self.id)
    User.where(user_address_id: addresses_in_ward.pluck(:id))
  end

  def active_legislator #this just assumes that wards don't have past legislators...works for our current needs
    Legislator.find_by_represented_ward_id(self.id)
  end #returns legislator object

  def alderman
    User.find(active_legislator.alderman_id)
  end #returns the user object

end
