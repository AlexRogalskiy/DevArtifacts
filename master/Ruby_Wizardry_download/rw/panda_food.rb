require './colorize'

class Food
  def serve
    puts 'Food is ready!'
  end
end

class PandaFood < Food
  include Colorize

  attr_accessor :calories

  CALORIES_PER_SERVING = 1000

  def initialize
    @calories = CALORIES_PER_SERVING
  end

  def serve
    puts 'One piping hot serving of panda food, coming up!'
  end

  def analyze
    puts "This food contains #{@calories} calories and is #{color}."
  end
end

hogarths_food = PandaFood.new
puts hogarths_food.analyze
