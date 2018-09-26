# frozen_string_literal: true

require 'bundler'
Bundler.setup :default

require 'pp'
require 'vkontakte'
require 'pry'

puts Vkontakte::VERSION

if $PROGRAM_NAME == __FILE__
  CLIENT_ID = '5987497'

  email = ARGV[0]
  pass  = ARGV[1]

  vk = Vkontakte::Client.new(CLIENT_ID)
  vk.login!(email, pass, open_captcha: true, permissions: 'friends,wall')

  current_user = vk.api.users_get.first

  second_circle = {}
  second_circle.default = 0
  # [uid, uid, ...]

  my_friends = []
  fr_count = 5000
  fr_offset = 0
  loop do
    fr = vk.api.friends_get(order: 'hints', count: fr_count, offset: fr_offset * fr_count)['items']
    break if fr.empty?
    my_friends << fr
    fr_offset += 1
  end
  my_friends.flatten!

  good_friends = 0
  bad_friends = 0

  # информацию о отправленных заявках на добавление в друзья
  fr_count = 1000
  fr_offset = 0
  friends_requests = []

  loop do
    fr = vk.api.friends_getRequests(out: 1, count: fr_count, offset: fr_offset * fr_count)['items']
    break if fr.empty?
    friends_requests << fr
    fr_offset += 1
  end
  friends_requests.flatten!

  parse_friends_count = 30
  puts "You have #{my_friends.count} friends"
  puts "#{friends_requests.count} people already receive request"

  my_friends[0...parse_friends_count].each_with_index do |uid, index|
    begin
      print "Parsing your friends: #{index + 1} of #{parse_friends_count}. Good: #{good_friends}. Bad: #{bad_friends}\r"
      friends = vk.api.friends_get(user_id: uid)['items']
      good_friends += 1
    rescue Vkontakte::API::Error
      # Permission to perform this action is denied by user
      bad_friends += 1
      next
    end
    friends.each { |f| second_circle[f] += 1 }
  end

  puts "\nComplete"

  second_circle.reject! { |uid, count| my_friends.include?(uid) || friends_requests.include?(uid) || current_user['id'] == uid || count < 2 }

  puts "Total people in 2nd circle: #{second_circle.size}"

  # Сортировка по количеству общих знакомых
  sorted_second_circle = second_circle.sort { |a, b| b[1] <=> a[1] } # <-- Hash sorting by value

  # sorted_second_circle           # => [['uid1', 1], ['uid2', 2], ['uid3', 3]]
  # sorted_second_circle.transpose # => [["uid1", "uid2", "uid3"], [1, 2, 3]]

  common_friends = vk.api.users_get(user_ids: sorted_second_circle[0...99].transpose[0].join(',').to_s)

  puts 'Getting common friends.'
  common_friends = []
  sorted_second_circle.each_slice(300) do |ids|
    sleep 1
    cf =  vk.api.users_get(user_ids: ids.transpose[0].join(',').to_s)
    break if cf.empty?
    common_friends << cf
  end

  common_friends.flatten!
  puts "Total common friends: #{common_friends.size}"

  sorted_second_circle.each do |uid, count|
    begin
      sleep 1
      user = vk.api.users_get(user_id: uid).first

      next if  user['deactivated']

      friend = common_friends.find { |f| f['id'] == uid }

      next unless friend

      puts "[#{count}]: [#{friend['id']}] #{friend['first_name']} #{friend['last_name']}"
      vk.api.friends_add(user_id: friend['id'])
    rescue Vkontakte::API::Error => err
      puts err.message

      case err.error_code
      when 1
        puts 'Come back tomorrow'
        break
      when *[175, 176]
        next
      else
        sleep 60
        retry
      end
    end
  end

end
