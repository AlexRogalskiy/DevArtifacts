require 'net/http'
require 'json'

class MapController < ApplicationController
  def index
    url = URI.parse('http://register-office.openregister.org/all.json')
    req = Net::HTTP::Get.new(url.to_s)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }

    @offices = JSON.parse(res.body)
    @postcode = params[:postcode]
  end
end
