
####################################### PSEUDOCODE #####################################

# INPUT:  Initialize object with input 16-digit integer parameter
# OUPUT:  #initialize outputs invalid ArgumentError for input integers not 16 digits
#         #CreditCard#check_card outputs boolean true/false for
#         valid/invalid digits as credit card number
# STEPS:  #initialize     raise ArgumentError if input parameter is not 16 digits
#                         set input to instance variable for card number
          #card_number    isolate digits to double and multiply them by 2
#                         break any resulting double digit numbers
#                         sum all digits
#                         if result is evenly divisible by 10, return true
#                         otherwise, return false

###################################### INITIAL CODE ####################################

class CreditCard

  def initialize(card_number)
    raise ArgumentError.new("Invalid card length.") if card_number.to_s.length != 16
    @card_number = card_number
  end

  def check_card
    card_digit_arr = @card_number.to_s.chars.map(&:to_i)
    summed_digit_arr = card_digit_arr.reverse.each_with_index.map do |x , i|
      i.odd? ? ((x * 2).to_s.chars.map(&:to_i).inject(0) {|sum, ind| sum + ind}) : x
    end
    summed_digit_arr.reduce(:+) % 10 == 0
  end
end

#################################### REFACTORED CODE ###################################
class CreditCard

  def initialize(card_number)
     raise ArgumentError.new("Invalid card length.") if card_number.to_s.length != 16
    @card_number = card_number
  end

  def check_card
   validate = @card_number.to_s.reverse.gsub!(/(\d)(\d)/){|match| $1 + ($2.to_i*2).to_s}
   validate.chars.map(&:to_i).reduce(:+) % 10 == 0
  end

end


######## ANOTHER VERSION: DEMONSTRATING ENUMERABLES FOR DBC PHASE 0 STUDENTS #############

class CreditCard
 
  def initialize(card_number)
    raise ArgumentError.new("Invalid card length.") if card_number.to_s.length != 16
    @card_number = card_number
  end
 
  def check_card
    validate = @card_number.to_s.chars.collect_concat.with_index do |x, i|
      i.odd? ? (x.to_i * 2).to_s.chars : x # didn't reverse cuz set 16 digit input; now need to isolate odd indicies 
    end
    validate.map(&:to_i).reduce(:+) % 10 == 0
  end
end

###################################### DRIVER CODE #####################################
# card = CreditCard.new("11111111111111112") # => ArgumentError
# card = CreditCard.new("1") # => ArgumentError

card = CreditCard.new("4408041234567893")
p card.check_card  == true # => true

card = CreditCard.new("4408041234567892")
p card.check_card  == false # => true



####################################### REFLECTION FROM MY PHASE 0 AT DBC  #####################################

#My initial thought was to reverse the digits as a string, split into an array,
#and use the elements' index to determine which to double, a good situation to
#use each_with_index. My approach was sucecssful but rather long and requiring a
#many long method chains. Refactoring, I wanted to implement regex and see if I
#could do away with the array completely. This approach worked well to easily
#isolate pairs of digits. Using match groups, I could further isolate the
#individual numbers to convert and double, returning a contacted string of all
#the single digit numbers to sum. I'm not sure which way is more efficient in
#terms of processing benchmark--maybe something to check out.

