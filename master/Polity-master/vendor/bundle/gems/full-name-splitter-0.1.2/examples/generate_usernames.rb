require File.expand_path(File.dirname(__FILE__)) + '/../lib/full_name_splitter.rb'


class Incognito
  include PersonalIdentity
  transform :full_name, :to => [:first_name, :last_name]
  attr_accessor :first_name, :last_name
end


names = [
   "John Smith",
   "Kevin Bluth-Funke",
   
   "Kevin J. O'Connor",
   "Gabriel Van Helsing",
   "Pierre de Montesquiou",
   "Charles d'Artagnan",
   "Jaazaniah ben Shaphan",
   "Noda' bi-Yehudah",
   "Maria del Carmen Menendez",
   "Alessandro Del Piero",
  
   "George W Bush",
   "George H. W. Bush",
   "James K. Polk",
   "William Henry Harrison",
   "John Quincy Adams"
]

usernames = []

names.each do |full_name|
  firstname, lastname = FullNameSplitter.split(full_name)
  firstname = firstname.to_s[0..0]
  lastname  = lastname.gsub(/(?:(?:\w)+\-)?(\w+)/, "\\1").gsub(/[^\w]/, "")
  usernames << ("#{firstname}.#{lastname}").downcase
end

firstname, lastname = PersonalIdentity[full_name]

puts usernames