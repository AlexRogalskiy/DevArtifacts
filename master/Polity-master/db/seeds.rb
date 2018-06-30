require 'faker'
require 'uri'
require 'net/http'
require 'json'
require 'full-name-splitter'

#--------IMPORT CHICAGO LEGISLATORS--------------------------------------------------------------------------

image_and_twitter_accounts = [["http://www.cityofchicago.org/content/dam/city/about/wards/01/aldward01.jpg", "@Alderman_Moreno"], ["http://www.cityofchicago.org/content/dam/city/about/wards/02/aldfioretti.jpg", "@Fioretti2ndWard"], ["http://www.cityofchicago.org/content/dam/city/about/wards/03/pdowellsm.jpg", "@AldPatDowell3rd"], ["http://www.cityofchicago.org/content/dam/city/about/wards/04/aldward4.jpg", "@Ald4_WillBurns"], ["http://www.cityofchicago.org/content/dam/city/about/wards/05/aldward5photo.jpg", "@5thWardChicago"], ["https://pbs.twimg.com/profile_images/1108313139/headshot_1_small_400x400.jpg", "@RoderickTSawyer"], ["http://www.cityofchicago.org/content/dam/city/about/wards/07/aldward7.png", "@Ald7Holmes"], ["http://www.cityofchicago.org/content/dam/city/about/wards/08/aldward8.jpg", "@AldermanHarris"], ["http://www.cityofchicago.org/content/dam/city/about/wards/09/aldward9.jpg", "@Alderman_Beale"], ["http://www.cityofchicago.org/content/dam/city/about/wards/10/aldward10.jpg", "@AldermanPope"], ["http://www.cityofchicago.org/content/dam/city/about/wards/11/aldward11.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/12/aldward12.jpg", "none"], ["http://www.chicagoreader.com/imager/marty-quinn-13th-ward/b/original/3696246/dc66/13martyQuinn_magnumn.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/14/aldward14.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/15/aldward15.jpg", "@ToniFoulkes"], ["http://www.cityofchicago.org/content/dam/city/about/wards/16/aldward16.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/17/aldward17.jpg", "@ThomasLawSuites"], ["http://www.cityofchicago.org/content/dam/city/about/wards/18/aldward18.jpg", "@lona_lane"], ["http://www.chicagoreader.com/imager/matthew-oshea-19th-ward/b/original/3696232/aecf/19mattO_Shea_magnum.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/20/aldward20.jpg", "@AldWillieB"], ["http://www.cityofchicago.org/content/dam/city/about/wards/21/aldward21.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/22/aldward22.jpg", "@AldermanMunoz22"], ["http://www.cityofchicago.org/content/dam/city/about/wards/23/aldward23.jpg", "none"], ["http://www.chicagoreader.com/imager/michael-chandler-24th-ward/b/original/3696226/c2de/24mikeChandler_magnum.jpg", "none"], ["http://media.tumblr.com/tumblr_lzeoqgPCAJ1qgb8yy.jpg", "@AldermanSolis"], ["http://www.cityofchicago.org/content/dam/city/about/wards/26/aldward26.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/27/aldward27.jpg", "@AldermanBurnett"], ["http://www.chicagoreader.com/imager/jason-ervin-28th-ward/b/original/3696572/5cf3/28jasonErvin_magnum.jpg", "@AldermanErvin"], ["http://www.cityofchicago.org/content/dam/city/about/wards/29/aldward29.png", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/30/aldward30.jpg", "@Ald_Reboyras"], ["http://media.apps.chicagotribune.com/municipal2011/site_media/candidate_photos/31raysuarez.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/32/aldward32.jpg", "@ward32chicago"], ["http://www.cityofchicago.org/content/dam/city/about/wards/33/aldward33.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/34/aldward34.png", "none"], ["http://1.bp.blogspot.com/-ut1ILEjWShc/TsP-MLE_RkI/AAAAAAAAAA8/ra850uNkyy8/s1600/Rey+Colon.jpg", "none"], ["http://media.apps.chicagotribune.com/municipal2011/site_media/images/ebq/file_418713_139849832_0_nick2.jpg", "@AldermanSposato"], ["http://www.suntimes.com/csp/cms/sites/dt.common.streams.StreamServer.cls?STREAMOID=g9o4aasJWhO4aKwuJT4rG8$daE2N3K4ZzOUsqbU5sYuEK2_8kgKz1SdeVLy0QQ4dWCsjLu883Ygn4B49Lvm9bPe2QeMKQdVeZmXF$9l$4uCZ8QDXhaHEp3rvzXRJFdy0KqPHLoMevcTLo3h8xh70Y6N_U_CryOsw6FTOdKL_jpQ-&CONTENTTYPE=image/jpeg", "@EmmaMittsAld37"], ["http://www.ward38.com/site/pics/290/5077/20754/536595/Cullerton_official_picture.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/39/aldward39.jpg", "none"], ["http://www.trbimg.com/img-528424d8/turbine/ct-met-aj-1-city-council-1114-jpg-20131113/600/600x409", "@40thWard"], ["http://blogs.wttw.com/chicagotonight/files/2011/02/ward41-mary-oconnor.jpg", "none"], ["http://www.cityofchicago.org/content/dam/city/about/wards/42/aldward42.jpg", "@AldermanReilly"], ["http://oldtownchicago.org/wp-content/uploads/2013/03/Alderman-Michele-Smith-43rd-Ward.jpg", "@AldermanSmith43"], ["http://www.cityofchicago.org/content/dam/city/about/wards/44/aldward44.jpg", "@AldTomTunney"], ["http://chicagodispatcher.com/clients/chicagodispatcher/JohnArena.jpg", "@JohnArena445"], ["http://www.chicagoreader.com/binary/5e7c/1362684418-cappleman.jpeg", "@JamesCappleman"], ["http://www.cityofchicago.org/content/dam/city/about/wards/47/aldward47.jpg", "@Alderman_Pawar"], ["http://2.bp.blogspot.com/_3J3xyLUMKUE/TIZTO6BuqRI/AAAAAAAACRE/W9APt8-JDOo/s320/osterman.jpg", "@48Ward"], ["http://www.cityofchicago.org/content/dam/city/about/wards/49/aldward49.jpg", "@JoeMoore49"], ["http://blogs.wttw.com/chicagotonight/files/2011/02/ward50-debra-silverstein.jpg", "@Debra4Alderman"]
]

def importLegislatorInfo(url)
  data = Net::HTTP.get(url)
  @parsed_data = JSON.parse(data)
end

ward_json_url = URI("http://data.cityofchicago.org/resource/htai-wnw4.json")

importLegislatorInfo(ward_json_url)

@parsed_data.each_with_index do |ward_row_hash, index|
  first_name = FullNameSplitter.split(ward_row_hash["alderman"]).first
  last_name = FullNameSplitter.split(ward_row_hash["alderman"]).last
  email = ward_row_hash["email"]
  unless ward_row_hash["email"]
    email = "null#{index}@null.com"
  end

  user = User.new(first_name: first_name,
                  last_name:last_name,
                  email: email,
                  password: "Password1",
                  password_confirmation: "Password1")

  user.save!
  if user.save
    human_address_hash = JSON.parse(ward_row_hash["location"]["human_address"])
    ward_number = ward_row_hash["ward"]
    ward_address1 = ward_row_hash["address"]
    ward_zip = human_address_hash["zip"]
    ward_phone = ward_row_hash["ward_phone"]["phone_number"]

    ward = Ward.create!(
      ward_number: ward_number,
      address1: ward_address1,
      phone_number: ward_phone,
      zip: ward_zip
    )

    if ward.valid?
      user_address_street1 = ward_row_hash["city_hall_address"]

      user_address = UserAddress.new(ward_id: ward.id,
                                     address1: user_address_street1)
      user_address.save
      user.update_attributes(user_address_id: user_address.id)
      legislator = Legislator.create!(represented_ward_id: ward.id,
                                      alderman_id: user.id)
    end
  end
end

aldermen = User.all
image_and_twitter_accounts.each_with_index do |info, index|
  image = info[0].to_s
  twitter = info[1].to_s
  aldermen[index].update_attributes!(img_url: info[0].to_s, twitter_handle: info[1].to_s)
end

#-------------IMPORT CITY COUNCIL LEGISLATION-------------------------------------------------------
  def get_legislation_title_and_city_identifier(json)
    legislation_info = []
    table_length = json["TaggedPDF-doc"]["Part"][1]["Table"].length
    if table_length > 1
      json["TaggedPDF-doc"]["Part"][1]["Table"][0]["TR"].each do |header_hash|
        if header_hash.has_key?("TD")
          legislation_info << header_hash["TD"]  # LEGISLATION INFO ON EACH ORDINANCE
        end
      end
    else
      json["TaggedPDF-doc"]["Part"][1]["Table"]["TR"].each do |header_hash|
        if header_hash.has_key?("TD")
          legislation_info << header_hash["TD"]  # LEGISLATION INFO ON EACH ORDINANCE
        end
      end
    end
    legislation_info
  end

  def get_vote_tallies(json_votes)

    json_votes.flatten[1]["Part"].each do |key, value|
      votes_on_pending_legislation = []
      if key["Sect"].class == Array    # DOCUMENT WITH MULTIPLE ORDINANCES TO VOTE ON
        key["Sect"].each do |hash|

          if hash != nil && hash.has_key?("Table")
            votes = []
            hash['Table'].flatten.length
            hash["Table"].each do |table_hash|
              table_hash.each do |key, value|
                value.each do |alderman_hash|
                  if alderman_hash["TD"]
                    votes << alderman_hash["TD"]
                  end
                end
              end
            end
            votes_on_pending_legislation << votes

          elsif hash != nil && hash.has_key?("Sect")   # DOCUMENT WITH A SINGLE ORDINANCE TO VOTE ON
            votes = []
            hash["Sect"][1].each do |table_hash|
              table_hash.flatten.each do |vote_table|
                if vote_table["TR"].class == Array
                  vote_table["TR"].each do |alderman_hash|
                    if alderman_hash["TD"]
                      votes << alderman_hash["TD"]  # THIS IS WHERE THE VOTES ARE...
                    end
                  end
                end
              end
            end
            votes_on_pending_legislation << votes
          end
        end
      end
      if !votes_on_pending_legislation.empty?
        return votes_on_pending_legislation
      end
    end
  end

file = File.read(Dir.pwd + '/db/rollcall1.json')
file2 = File.read(Dir.pwd + '/db/rollcall2.json')
file3 = File.read(Dir.pwd + '/db/rollcall3.json')
file4 = File.read(Dir.pwd + '/db/rollcall4.json')
meeting1 = JSON.parse(file)
meeting2 = JSON.parse(file2)
meeting3 = JSON.parse(file3)
meeting4 = JSON.parse(file4)

meetings = [meeting1, meeting2, meeting3, meeting4]

meetings.each do |meeting|
  ordinances = get_legislation_title_and_city_identifier(meeting)
  vote_tallies = get_vote_tallies(meeting)

  ordinances.each_with_index do |ordinance, index|
    city_id = ordinance[0]
    title = ordinance[1]
    legislation = Legislation.create!(   # Not all fields in DB filled, especially dates.
      city_identifier: city_id,
      title: title,
      status: "Voted",
      kind: "Ordinance"
    )
    vote_tallies[index].each do |alderman_vote|
      alderman = Legislator.find_by_represented_ward_id(alderman_vote[0])
      LegislatorVote.create!(
        legislation_id: legislation.id,
        legislator_id: alderman.id,
        vote: alderman_vote[2]
      )
    end
  end
end


#-----------RECENTLY INTRODUCED LEGISLATION--------------------------------------------

upcoming = File.open(Dir.pwd + "/db/upcoming_legislation.txt", "r")

all_legislations = []
legislation = []
introduced_legislation = []

upcoming.each_line do  |line|
    legislation << line.chomp
  if legislation.length >= 7
    all_legislations << legislation
    legislation = []
  end
end

all_legislations.each do |info|
  introduced_legislation << Hash[all_legislations[0].zip(info)]
end

introduced_legislation.shift

introduced_legislation.each do |record|
  legislation = Legislation.create!(
    city_identifier: record["Record #"],
    kind: record["Type"],
    status: record["Status"],
    opened_date: record["Intro Date"],
    closed_date: record["Final Action"],
    title: record["Title"]
  )
  alderman = Legislator.find_by_represented_ward_id(record["Main Sponsor's Ward/Office"].to_i)
  sponsor = alderman ? alderman.id : nil

  LegislationSponsor.create!(
    sponsor_id: sponsor,
    legislation_id: legislation.id
  )
end



#-----------RELEVANT FAKER DATA---------------------------------------------------------

all_wards = Ward.all

user_addresses = 300.times do
  UserAddress.create!(ward_id:  all_wards.sample.id,
                      address1: Faker::Address.street_address,
                      address2: Faker::Address.secondary_address,
                      zip:      Faker::Address.zip)
end


all_addresses = UserAddress.all

users = 600.times do
  User.create!(
    first_name: Faker::Name.first_name,
    last_name:              Faker::Name.last_name,
    email:                  Faker::Internet.email,
    # avatar:                 Faker::Avatar.image,  FUNCTIONAL? -- COULD USE IMG URL AS BACKUP
    password:               "1Password!",
    password_confirmation:  "1Password!",
    user_address_id:         all_addresses.sample.id
  )
end

Legislation.all.each do |legislation|
  (1 + rand(3)).times do
    LegislationSponsor.create!(
      sponsor_id: Legislator.all.sample.id,
      legislation_id: legislation.id
    )
  end
end

aldermen_ids = Legislator.all.pluck(:alderman_id)
users = User.all.pluck(:id)

regular_user_ids = users - aldermen_ids
legislation_ids = Legislation.all.pluck(:id)


regular_user_ids.each do |x|
  legislation_ids.each do |y|
    LegislationVoice.create!(
      user_id: x,
      legislation_id: y,
      support: [true, false].sample,
      feedback: Faker::Lorem.words(15).join(" ")
    )
  end
end







#----------------------------FAKER DATA OUTLIVED BY REAL DATA---------------------

# # current_aldermen_ids = [*21..70]
# # ward_numbers = [*1..50]

# # parties = ["democrat", "republican", "independent"]

# # legislators_now = 50.times do
# #   Legislator.create!(alderman_id:         current_aldermen_ids.shuffle.pop,
# #                      represented_ward_id: ward_numbers.shuffle.pop,
# #                      term_start_date:     "10/1/2011",
# #                      #NO END DATE
# #                      party_affiliation:   parties.sample)
# # end

# # past_aldermen_ids = [*71..120]
# # ward_numbers = [*1..50]

# # legislators_past = 50.times.map do
# #   Legislator.create!(alderman_id:         past_aldermen_ids.shuffle.pop,
# #                      represented_ward_id: ward_numbers.shuffle.pop,
# #                      term_start_date:     "10/1/2007",
# #                      term_end_date:       "9/30/2011",
# #                      party_affiliation:   parties.sample)
# # end




# #########################################################

# status_options_open = ["active", "open"]
# status_options_closed = ["inactive", "closed"]
# type_options = ["reports", "resolution", "ordinance"]

# vote_options = ["Y", "N"]



# legislations = 30.times.map do
#   Legislation.create!(city_identifier: "123456_city_identifier",
#                       status:          status_options_closed.sample,
#                       kind:            type_options.sample,
#                       opened_date:     rand(2.years).ago,
#                       closed_date:     "5/23/2014" )
# end

# # *****************************************************************

# Legislator.all.each do |legislator|
#   Legislation.all.each do |issue|
#     LegislatorVote.create!(legislation_id: issue.id,
#                            legislator_id:  legislator.id,
#                            vote_date:      "5/24/2014",
#                            vote:           vote_options.sample)
#   end
# end


# # *****************************************************************


# legislations = 30.times.map do
#   Legislation.create!(city_identifier: "123456_city_identifier",
#                       status:          status_options_open.sample,
#                       kind:            type_options.sample,
#                       opened_date:     rand(2.years).ago )
# end


# ######################################################################

# sponsor_number = [*1..3]



# Legislation.all.each do |issue|
#   issue.update_attributes(:title => Faker::Lorem.words(5).join(" "))

# end
