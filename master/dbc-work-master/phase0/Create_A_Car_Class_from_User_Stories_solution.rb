# CREATE A CAR CLASS FROM USER STORIES
# --------------------------------
# Caroline Artz
# 2/15/2014
# Contents: class Car, class Pizza, class Trip, driver code, relfection


# Class #1 - class Car
# ---------------------

class Car
  attr_accessor :distance_traveled, :pizza_delivery
  DIRECTIONS = %w(North East South West)

  def initialize(color, make, model, pizza_capacity, heading = 'North')
    @color = color
    @make = make
    @model = model
    @pizza_capacity = pizza_capacity
    @pizza_delivery = []
    @driving = false
    @speed = 0
    @distance_traveled = 0.0
    @heading = heading
  end

  def load_pizza_compartment(order)
    @pizza_delivery << order
    raise ArgumentError, 'That\'s too much tuna! I mean, pizza...' unless pizza_delivery.flatten.length <= @pizza_capacity
  end

  def change_speed(target_speed)
    @driving = true
    until @speed == target_speed.to_i
      @speed < target_speed.to_i ? @speed += 1 : @speed -= 1
    end
    print "\nTraveling #{@heading} at #{@speed} mph"
  end

  def drive(distance, speed = @speed)
    change_speed(speed.to_i)
    @distance_traveled += distance.to_f
    puts " for #{distance} miles."
  end

  def stop(signal) #not calling change_speed(0) method anymore so I can display play-by-play more appropriately
    @speed = 0
    @driving = false
    puts "Stopped at #{signal}"
  end

  def turn(direction)
    unless (direction.downcase == 'left') || (direction.downcase == 'right')
      raise ArgumentError, 'Turn direction must be \'right\' or \'left\' '
    end
    direction.downcase == 'left' ? directions = DIRECTIONS : directions = DIRECTIONS.reverse
    @heading = directions[directions.index(@heading) - 1]
  end

  def delivery_destination
    stop('destination')
    print "\nYou have reached the next delivery.\n"
    puts  "\nDelivering Order:"
    get_next_order
  end

  def get_next_order #FIFO for warm pizza!
    raise ArgumentError, 'All out of pizzas' if @pizza_delivery.empty?
    @pizza_delivery[0].each do |pizza|
      puts pizza.display_pizza
    end
    @pizza_delivery.shift
  end

  def get_remaining_pizzas
    @pizza_delivery
  end

end

# Class #2 - class Pizza
# -----------------------

class Pizza
  attr_accessor :special_instructions
  attr_writer :options, :display_order

  def initialize(size, crust)
    check_menu_error('crust') {['pan', 'thin crust', 'gluten-free'].include?(crust.downcase)}
    check_menu_error('size') {[8, 12, 16].include?(size)}
    @size= size
    @crust = crust
    @special_instructions = 'none'
  end

  def options(*toppings)
    @toppings = Array(toppings)
    unless @toppings - ['extra cheese', 'pepperoni', 'sausage', 'pineapple', 'onion', 'green pepper'] == []
      raise ArgumentError, 'Check menu for topping.'
    end
    yield if block_given?
  end

  def display_pizza
    puts "#{@size} in. #{@crust} pizza"
    puts 'Toppings & Extras:'
    @toppings.empty? ? (puts 'regular cheese only') : (puts @toppings)
    puts "Special instructions: #{@special_instructions}"
  end

  def check_menu_error(kind)
    raise ArgumentError, "Check menu for #{kind} options" unless yield
  end

end

# Class #3 - class Trip
# ----------------------

class Trip
  def initialize(car, route)
    @car = car
    @route = Array(route)
  end

  def travel
     @route.each {|direction| @car.send *direction}
    puts "Total Distance: #{@car.distance_traveled} miles"
  end
end


# DRIVER CODE
# ------------

#Instantiate Pizza Delivery Car
car = Car.new('black', 'Lamborghini', 'Murcielago', 4)

#Instantiate pizza order #1, add options, add to car's pizza compartment
order1 = [pizza1 = Pizza.new(8,'gluten-free'), pizza2 = Pizza.new(12,'pan')]
pizza1.options {pizza2.special_instructions = 'extra well-done, please'}
pizza2.options('green pepper', 'pepperoni')

car.load_pizza_compartment(order1)
#Instantiate pizza order #2, add options, add to car's pizza compartment
order2 = [pizza3 = Pizza.new(16,'thin crust')]
pizza3.options('extra cheese') {pizza3.special_instructions = 'go light on the sauce, please'}

car.load_pizza_compartment(order2)

#Route to first delivery
route = [['drive', 0.25, 25], ['stop', 'stop sign'], ['turn', 'right'], ['drive', 1.5, 35], ['drive', 0.25, 15],
         ['stop', 'stop sign'], ['turn', 'left'], ['drive', 1.4, 35], 'delivery_destination']

#Instantiate trip, travel & delivery pizza
trip = Trip.new(car, route)
trip.travel

#Print any remaining pizzas for delivery
puts "\nWhat\'s left?"
car.get_remaining_pizzas.flatten.each {|pie| pie.display_pizza}



# REFLECTION
# ----------------------
# I was able to work with a guide on this exercise during a pair when my partner didn't show up. He
# was extremely helpful and I appreciated that he further pushed me to make this problem more
# challenging. The things I liked most about this challenge was getting to use the #send method and
# additional practice with blocks and yield. I can definitely see how the #send method will be a
# useful tool in the future. I need to move on from this challenge and work on other ones but if I
# was going to refactor this further, I would like to implement a hash for passing the arguments to
# the Car class. I'm going to try that type of approach on another challenge and maybe I can come
# back to this down the line and shape things up a bit more! 

# I tried to work on my 'confident code'--and coerce when in doubt (e.g., line 123 @route =
# Array(route)), but it's definitely difficult for me as I tend to write more timid code and am not
# 100% clear on all the ins and outs of confident code, assertive code, duck typing etc.