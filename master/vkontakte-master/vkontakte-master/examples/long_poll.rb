# frozen_string_literal: true

require 'bundler'
Bundler.setup :default

require 'vkontakte'

require 'pp'
require 'date'
require 'net/http'
require 'uri'
require 'json'

CLIENT_ID = '5987497'

offline = "\033[31;3mофлайн\033[0m"
online = "\033[32;3mонлайн\033[0m"

credentials = Vkontakte::AskForCredentials.new
email = credentials.email
pass  = credentials.password

vk = Vkontakte::Client.new(CLIENT_ID)
vk.login!(email, pass, permissions: 'messages')

# https://vk.com/dev/using_longpoll

resp = vk.api.messages_getLongPollServer
puts resp
key = resp['key']
server = resp['server']
ts = resp['ts']

loop do
  url = "https://#{server}?act=a_check&key=#{key}&ts=#{ts}&wait=25&mode=10&version=1"
  uri = URI.parse(url)
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true

  begin
    res = http.request(Net::HTTP::Get.new(uri.request_uri))
  rescue => err
    puts "[ERROR] #{err}"
    sleep 5
    retry
  end

  begin
    params = JSON.parse(res.body)
  rescue JSON::ParserError
    puts '[ERROR] JSON Parse Error'
  end

  # Время действия ключа для подключения к LongPoll серверу может истечь
  # через некоторое время, сервер вернёт параметр failed:
  # {failed: 2}
  #
  # в таком случае требуется переспросить его,
  # используя метод messages.getLongPollServer
  #
  if params['failed'] == 2
    puts '[INFO] Re-initilize Long Pool Server'

    begin
      resp = vk.api.messages_getLongPollServer
      key = resp['key']
      server = resp['server']
      ts = resp['ts']
    rescue Vkontakte::API::Error => err
      if err.error_code == 5
        puts '[ERROR] User authorization failed: access_token have heen expired'
        puts '[INFO] Getting a new access_token'
        vk.login!(email, pass, permissions: 'messages')
        retry
      end
    end

    next
  end

  params['updates']&.each do |e|
    uid = e[1].abs
    begin
      user = vk.api.users_get(user_ids: uid, fields: 'sex').first
    rescue Vkontakte::API::Error => err
      if err.error_code == 5
        puts "[ERROR] #{err.message}"
        puts '[INFO] Getting a new access_token'
        vk.login!(email, pass, permissions: 'messages')
        retry
      end
    end

    puts e if user.nil?
    first_name = user['first_name']
    last_name = user['last_name']
    state = %w[стало стала став][user['sex'].to_i]
    case e[0]
    when 8 then
      puts "#{Time.now.strftime('%d/%m/%y %H:%M:%S')}: #{first_name} #{last_name} #{state} #{online}"
    when 9 then
      puts "#{Time.now.strftime('%d/%m/%y %H:%M:%S')}: #{first_name} #{last_name} #{state} #{offline}"
    end
  end
  # Сохранение нового значения ts
  ts = params['ts']
end
