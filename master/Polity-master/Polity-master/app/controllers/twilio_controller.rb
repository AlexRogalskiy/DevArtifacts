require 'twilio-ruby'

class TwilioController < ApplicationController
  # include Webhookable

  # after_filter :set_header

  # skip_before_action :verify_authenticity_token

  # def call
  #   host_and_port = request.host
  #   host_and_port << ":9393" if request.host == "localhost"

  #   @client = Twilio::REST::Client.new ENV["ACCOUNT_SID"], ENV["AUTH_TOKEN"]

  #   call = @client.account.calls.create({
  #     :to => '412-780-3415',  #SEND PHONE NUMBER OF ALDERMAN OFFICE
  #     :from => '+14129064580',
  #     :method => 'GET',
  #     :fallback_method => 'GET',
  #     :status_callback_method => 'GET',
  #     :record => 'false',
  #     :url => "http://#{host_and_port}/users/#{current_user.id}"
  #   })

  #   render nothing: true
  # end

  # def talk
  #   <?xml version="1.0" encogding="UTF-8"?>
  #   # <Response>
  #   #   <Dial timeout="10" record="true"></Dial>
  #   # </Response>
  # end
  # # :url => 'http://localhost:3000/users/show/'

end

