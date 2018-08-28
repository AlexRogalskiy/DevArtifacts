class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  before_save { self.email = email.downcase}
  before_save { self.username = username.downcase}

	# Database Relationships
	has_many :events, dependent: :destroy

  has_many :relationships, foreign_key: "follower_id", dependent: :destroy
  has_many :followed_users, through: :relationships, source: :followed
  has_many :reverse_relationships, foreign_key: "followed_id", class_name:  "Relationship", dependent:   :destroy
  has_many :followers, through: :reverse_relationships, source: :follower

  has_many :likes, foreign_key: "liker_id", dependent: :destroy
  has_many :liked_events, through: :likes, source: :liked

  has_many :attends, foreign_key: "attendee_id", dependent: :destroy
  has_many :attended_events, through: :attends, source: :attended

	# Validations
  EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+\z/i
  USERNAME_REGEX = /\A[a-zA-Z0-9]+\Z/
	validates :username, presence: true,
	          length: {minimum: 3, maximum: 16},
            uniqueness: {case_sensitive: false},
            format: {with: USERNAME_REGEX}
	validates :email, presence: true,
            format: {with: EMAIL_REGEX},
            uniqueness: {case_sensitive: false}

	# Methods
	def following?(other_user)
		relationships.find_by(followed_id: other_user.id)
	end

  def follow!(other_user)
	  relationships.create!(followed_id: other_user.id)
  end

  def unfollow!(other_user)
	  relationships.find_by(followed_id: other_user.id).destroy
  end

	def liked?(event)
		likes.find_by(liked_id: event.id)
	end

	def like!(event)
		likes.create!(liked_id: event.id)
	end

  def unlike!(event)
	  likes.find_by(liked_id: event.id).destroy
  end

	def attending?(event)
		attends.find_by(attended_id: event.id)
	end

	def attend!(event)
		attends.create!(attended_id: event.id)
	end

	def leave!(event)
		attends.find_by(attended_id: event.id).destroy
	end
end
