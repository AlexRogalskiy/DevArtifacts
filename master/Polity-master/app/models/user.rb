class User < ActiveRecord::Base
  # include Paperclip::Glue

  belongs_to :user_address
  has_many :legislation_voices
  has_many :legislators

  has_many :created_meetings, class_name: "CommunityMeeting", foreign_key: :creator_id
  has_many :meeting_attendances
  has_many :meetings, through: :meeting_attendances, source: :community_meetings

  validates :email, presence: true, uniqueness: true

  has_attached_file :avatar, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => "/images/:style/missing.png"
  validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  def name
    "#{self.first_name.downcase.capitalize} #{self.last_name.downcase.capitalize}"
  end

  def ward
    self.user_address.ward
  end

  def ward_number
    address = UserAddress.find(self.user_address_id)
    p address
    p Ward.find_by_id(address.ward_id).ward_number
  end

  def alderman
    address = UserAddress.find(self.user_address_id)
    current_legislator = Legislator.where(:represented_ward_id => address.ward_id).first
    User.find(current_legislator.alderman_id)
  end


  def street_address1
    user_address.try(:address1)
    # WE MAY NEED THIS...............DON"T DELETE WITHOUT CONSULTING GROUP
    # address = UserAddress.find(self.user_address_id)
    # address.address1
  end

  def street_address2
    user_address.try(:address2)
    # WE MAY NEED THIS...............DON"T DELETE WITHOUT CONSULTING GROUP
    # address = UserAddress.find(self.user_address_id)
    # address.address2
  end

  def zip
    user_address.try(:zip)
    # WE MAY NEED THIS...............DON"T DELETE WITHOUT CONSULTING GROUP
    # address = UserAddress.find(self.user_address_id)
    # address.zip
  end

  def self.ward_members(ward)
    users = User.select(:user_address_id, :id)
    users.each_with_object([]) do |user, members|
      members << user if user.ward.id == ward
    end
  end

  def self.ward_member_ids(ward)
    User.ward_members(ward).each_with_object([]) do |user, ids|
      ids << user.id
    end
  end

  def return_legislation_voice(legislation)
    puts "here--------------------"
    puts legislation.id
    voice = LegislationVoice.where(user_id: self.id, legislation_id: legislation.id).last.support
    voice ? (return "Y") : (return "N")
  end

  def legislation_voices
    LegislationVoice.where(user_id: self.id)
  end


  def legislation_supporter?(legislation)
    if LegislationVoice.where("user_id = ? AND legislation_id = ? AND support = ?", self.id, legislation.id, true).empty?
      return nil
    else
      return true
    end
  end

  def legislation_voicer(legislation)
    LegislationVoice.where("user_id = ? AND legislation_id = ?", self.id, legislation.id).any?
  end


  # def self.by_legislation_support(legislation_id)
  #   issue_id = Legislation.find(legislation_id).id
  #   users = User.all
  #   users.each_with_object([]) do |user, supporters|
  #     supporters << user if user.legislation_supporter?(issue_id) == true
  #   end
  # end

end
