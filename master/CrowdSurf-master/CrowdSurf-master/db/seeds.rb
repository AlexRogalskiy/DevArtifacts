# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
@admin = User.find_by_email('awhearry@gmail.com')
unless @admin.present?
	@admin = User.create!(username: 'NoRest4AWhearry', email: "awhearry@gmail.com", password: 'champion',
	                      password_confirmation: 'champion', admin: true)
end
state_list = [
		'Georgia'
]

state_list.each do |name|
	@state = State.find_by_name("#{name}")
	unless @state.present?
		@state = State.new(name: name)
		@state.save
	end
end

# Cities
city_list = [
		['Atlanta', 1]
]
city_list.each do |name, state_id|
	@city = City.find_by_name_and_state_id("#{name}", "#{state_id}")
	unless @city.present?
		@city = City.new(name: name, state_id: state_id)
		@city.save
	end
end

# Categories
category_list = %w( Party Festival Concert Other Performance )
category_list.each do |name|
	@category = Category.find_by_name("#{name}")
	unless @category.present?
		@category = Category.new(name: name)
		@category.save
	end
end

i = 1
2.times do
	event = @admin.events.build(title: "Sample Event #{i}", location_name: 'Morehouse College',
	                            street: '830 Westview Drive SW', state_id: 1, city_id: 1, zip: '30314',  longitude: "-84.4140299", latitude: "33.7459101",
	                            start: '2014-09-28 23:00:00.000000', end: '2014-09-28 23:00:00.000000', category_id: 1,
	                            details: "Some sample data for event")
	event.save
	i += 1
end
2.times do
	 event = @admin.events.build(title: "Sample Event #{i}", location_name: 'Morehouse College',
	                    street: '830 Westview Drive SW', state_id: 1, city_id: 1, zip: '30314',  longitude: "-84.4140299", latitude: "33.7459101",
	                    start: '2014-09-29 23:00:00.000000', end: '2014-09-29 23:00:00.000000', category_id: 1,
	                    details: "Some sample data for event")
	 event.save
	i += 1
end
2.times do
	event = @admin.events.build(title: "Sample Event #{i}", location_name: 'Morehouse College',
	                            street: '830 Westview Drive SW', state_id: 1, city_id: 1, zip: '30314',  longitude: "-84.4140299", latitude: "33.7459101",
	                            start: '2014-09-30 23:00:00.000000', end: '2014-09-30 23:00:00.000000', category_id: 1,
	                            details: "Some sample data for event")
	event.save
	i += 1
end
2.times do
	event = @admin.events.build(title: "Sample Event #{i}", location_name: 'Morehouse College',
	                            street: '830 Westview Drive SW', state_id: 1, city_id: 1, zip: '30314',  longitude: "-84.4140299", latitude: "33.7459101",
	                            start: '2014-10-01 23:00:00.000000', end: '2014-10-01 23:00:00.000000', category_id: 1,
	                            details: "Some sample data for event")
	event.save
	i += 1
end
2.times do
	event = @admin.events.build(title: "Sample Event #{i}", location_name: 'Morehouse College',
	                            street: '830 Westview Drive SW', state_id: 1, city_id: 1, zip: '30314',  longitude: "-84.4140299", latitude: "33.7459101",
	                            start: '2014-10-02 23:00:00.000000', end: '2014-10-02 23:00:00.000000', category_id: 1,
	                            details: "Some sample data for event")
	event.save
	i += 1
end
2.times do
	event = @admin.events.build(title: "Sample Event #{i}", location_name: 'Morehouse College',
	                            street: '830 Westview Drive SW', state_id: 1, city_id: 1, zip: '30314',  longitude: "-84.4140299", latitude: "33.7459101",
	                            start: '2014-10-03 23:00:00.000000', end: '2014-10-03 23:00:00.000000', category_id: 1,
	                            details: "Some sample data for event")
	event.save
	i += 1
end
2.times do
	event = @admin.events.build(title: "Sample Event #{i}", location_name: 'Morehouse College',
	                            street: '830 Westview Drive SW', state_id: 1, city_id: 1, zip: '30314',  longitude: "-84.4140299", latitude: "33.7459101",
	                            start: '2014-10-04 23:00:00.000000', end: '2014-10-04 23:00:00.000000', category_id: 1,
	                            details: "Some sample data for event")
	event.save
	i += 1
end
