module LegislatorsHelper
  def constituents
    addresses = UserAddress.where(ward_id: self.represented_ward_id)
    address_ids = addresses.pluck(:id)
    User.where(user_address_id: address_ids)
  end

end
