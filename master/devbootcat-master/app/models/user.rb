class User < ActiveRecord::Base
    validates :email, presence: true, uniqueness: true
    has_many :posts, foreign_key: :author_id

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
end
