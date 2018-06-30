FactoryGirl.define do |f|
  factory :post do |f|
    # f.author_id { Faker::Number.number(1) }
    f.title "New Title"
    f.body { Faker::Lorem.sentence(5)}
  end


  factory :invalid_post, parent: :post do |f|
    f.title nil
  end

end