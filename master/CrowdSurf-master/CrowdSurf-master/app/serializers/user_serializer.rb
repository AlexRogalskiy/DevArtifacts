class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :username, :admin

end
