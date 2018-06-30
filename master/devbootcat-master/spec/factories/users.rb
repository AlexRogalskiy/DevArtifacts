FactoryGirl.define do
  factory :user do |f|
    f.email "g@gmail.com"
    f.password "password" 
  end

  factory :invalid_user, parent: :user do
    email "g@gmail.com"
    # password nil
  end
end