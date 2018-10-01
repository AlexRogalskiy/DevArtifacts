my_own_menu = { 'tater_tots' => 2,
  'fancy_toast' => 3,
  'omelette' => 3,
  'tiny_burger' => 4,
  'chunky_bacon' => 1,
  'root_beer_float' => 2,
  'egg_nog' => 2
}

puts "Object ID before: #{my_own_menu.object_id}"

my_own_menu.keys.each do |key|
  my_own_menu[key.to_sym] = my_own_menu.delete(key)
end

puts "Object ID after: #{my_own_menu.object_id}"

puts my_own_menu
