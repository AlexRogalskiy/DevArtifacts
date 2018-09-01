require 'net/http'
require 'json'
require 'openssl'
require 'geokit'

class RegisterOfficeController < ApplicationController

  def index
    @postcode = params[:postcode]
    if @postcode.present?
      res = request_from_register('http://register-office.openregister.org/all.json')
      @offices = orderByClosest(@postcode, JSON.parse(res.body))

      @offices.first(3).each do |office|
        address = office['entry']['address']
        puts "http://address.openregister.org/address/#{address}.json"
        res = request_from_register("http://address.openregister.org/address/#{address}.json")

        puts res.code

        if res.code == '200'
          address_response = JSON.parse(res.body)
          puts address_response
          office[:address] = address_response['entry']
        end
      end
    end
  end

  def show

  end

  private

  def orderByClosest(address, latLangList)
    from=Geokit::Geocoders::GoogleGeocoder.geocode address

    latLangList.sort { |a, b|
      aDistance = distance([a['entry']['latitude'], a['entry']['longitude']], from.ll.split(","))
      bDistance = distance([b['entry']['latitude'], b['entry']['longitude']], from.ll.split(","))

      aDistance - bDistance
    }
  end

  def distance loc1, loc2
    rad_per_deg = Math::PI/180 # PI / 180
    rkm = 6371 # Earth radius in kilometers
    rm = rkm * 1000 # Radius in meters

    dlat_rad = (loc2[0].to_f-loc1[0].to_f) * rad_per_deg # Delta, converted to rad
    dlon_rad = (loc2[1].to_f-loc1[1].to_f) * rad_per_deg

    lat1_rad, lon1_rad = loc1.map { |i| i * rad_per_deg }
    lat2_rad, lon2_rad = loc2.map { |i| i * rad_per_deg }

    a = Math.sin(dlat_rad/2)**2 + Math.cos(lat1_rad.to_f) * Math.cos(lat2_rad.to_f) * Math.sin(dlon_rad/2)**2
    c = 2 * Math::atan2(Math::sqrt(a), Math::sqrt(1-a))

    rm * c # Delta in meters
  end

  def request_from_register(url)
    url = URI.parse(url)
    req = Net::HTTP::Get.new(url.to_s)
    res = Net::HTTP.start(url.host, url.port) {|http|
      http.request(req)
    }
    res
  end
end
