class Account
  attr_accessor :username, :password

  def initialize(username, password)
    @username = username
    @password = password
  end
end

class SuperSecretAccount < Account
  def initialize(username, password)
    @reset_attempts = 0
    super(username, password)
  end

  def password=(new_password)
    while @reset_attempts < 3
      print 'Current password?: '
      current_password = gets.chomp
      if @password == current_password
        @password = new_password
        puts "Password changed to: #{new_password}"
        break
      else
        @reset_attempts += 1
        puts "That's not the right password."
        puts "Attempt #{@reset_attempts} of 3 used up!"
      end
    end
  end

  def password
    'The password is secret!'
  end
end

regular = Account.new('Your name', 'your password')
super_safe = SuperSecretAccount.new('Your name', 'your password')

regular = Account.new('Your name', 'your password')
super_safe = SuperSecretAccount.new('Your name', 'your password')

puts "Your regular account password is: #{regular.password}"
regular.password = 'Something else!'
puts "Your regular account password is now: #{regular.password}"

puts "If we try to see the secret account password, we get: #{super_safe.password}"

changed_password = 'Something else!'

puts "Trying to change your secret account password to: #{changed_password}..."
super_safe.password = changed_password
