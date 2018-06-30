# Readable Code Refactoring Challenge
# -----------------------------------

# Goals of readable code
# 1. Elimination of repetition, using looping and branching wisely
# 2. Complex operations are decomposed into constituent parts
# 3. Descriptive names for methods, variables, classes, and modules
# 4. Methods are small and behavior is obvious
# 5. Minimizes need for comments because the code tells you what it is doing
# 6. Code is formatted with proper indentation for optimal readability


# My original code:
# -----------------
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


# Refactoring Notes:
# ------------------
# * Splitting into two classes => better reflect real world object relationships
#                                                           
# * Validation class => After splitting it made more sense IMO to decompose/clarify validation
#                    => Naming the validation class identifies applied algorithm
#
# * Valiadtion class methods => Decompose complex operations from original check_card method; 
#                               resutls in methods of mroe obvious behavior
#                            => (Re)named variables and methods to be more descriptive                        


# Code refactored for readability:
# --------------------------------

class CreditCard
  attr_reader :card_number
  def initialize(card_number)
    @card_number = card_number
  end

  def check_card
    (LuhnValidator.new(@card_number)).is_valid?
  end
end

class LuhnValidator
  def initialize(card_number)
    raise ArgumentError, 'Invalid card length.' if card_number.to_s.length != 16
    @card_string = card_number.to_s
  end

  def double_digits(number_as_string)
    number_as_string.reverse.gsub(/(\d)(\d)/) do |match|
      $1 + ($2.to_i*2).to_s
    end
  end

  def summed_digits
    double_digits(@card_string).chars.map(&:to_i).reduce(:+)
  end

  def is_valid?
    summed_digits.modulo(10) == 0
  end
end


# Review and Reflect:
# -------------------

# I'm curious to see how other people completed this assignment. For me, it is often difficult to
# remember that the least amount of code does not equal clear and concise code. That said, I was
# still surprised at how significant the discrepency in length between the old and new versions. I
# hope to find out if this is on the right track for refactoring, I definitely find the process
# difficult and sometimes counter-intuitive. I referenced a textbook I have on refactoring in
# addition to the resources provided and found it helpful. I will definitely be taking some time to
# review my fellow boots' solutions for this challenge if we're given the opportunity!
