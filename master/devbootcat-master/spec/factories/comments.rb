FactoryGirl.define do |f|
  factory :comment do |f|
    # f.author_id { Faker::Number.number(1) }
    f.text { Faker::Lorem.sentence(1)}
  end


  factory :invalid_comment, parent: :comment do |f|
    f.text nil
  end

end