# DBC Chicago Phase 0 Assessment

# EXERCISE 1
first_name = 'Caroline'
last_name = 'Artz'

puts first_name == 'Caroline' #=> true if == 'Caroline'
puts last_name == 'Artz' #=> true if == 'Artz'


#EXERCISE 2
 # I would: int_array.reduce(&:*), (or #inject); taking advantage of #reduce/#inject
 # memoization, passing the memo as a literal block to the multiply method, instead of #each
def calculate_product(array)
  int_array = Array(array) #when in doubt, coerce
  return nil if int_array.empty?
  raise ArgumentError, 'Requires integer array' unless int_array.detect {|i| !i.respond_to?(:odd?)} == nil

  product = 1
  int_array.each { |int| product *= int }
  product
end

puts calculate_product([1, 2, 3]) == 6 #=> true if == 6
puts calculate_product([0, -1, -10]) == 0 #=> true if == 0
puts calculate_product([1, -1, -10]) == 10 #=> true == 10
puts calculate_product([]) == nil #=> true if == nil
puts calculate_product(nil) == nil #=> true if == nil
puts calculate_product([0, 6, 0, 5]) == 0 #=> true if == 0
puts calculate_product([1]) == 1 #=> true (though product is binary operator...)
puts calculate_product([2, 4, 6, 8]) == 384 #=> true if == 384
puts calculate_product(['foo']) rescue (puts $!.message == 'Requires integer array') #=> true if single string array returns defined error message
puts calculate_product(235.5) rescue (puts $!.message == 'Requires integer array') #=> true if float returns defined error message
puts calculate_product('caroline') rescue (puts $!.message == 'Requires integer array') #=> true string returns defined error message


# EXERCISE 3
def calculate_product_odd(array)
  int_array = Array(array)
  raise ArgumentError, 'Requires integer array' unless int_array.detect {|i| !i.respond_to?(:odd?)} == nil
  return nil if int_array.count {|int| int.odd?} == 0

  product = 1
  int_array.each do |int|
    product *= int if int.odd?
  end
  product
end

puts calculate_product_odd([1,2,3]) == 3    #=> true, because 2 is even
puts calculate_product_odd([0,-1,-10]) == -1  #=> true, because 0 and -10 are even
puts calculate_product_odd([1,2,3,4,5]) == 15 #=> true, because 4 and 2 are even
puts calculate_product_odd([-1,-2,-5,-15,10]) == -75 #=> true, because -2 and 10 are even
puts calculate_product_odd([2,10]) == nil #=> true, because all elements of int array are even
puts calculate_product_odd([]) == nil #=> true, because no element of empty array are odd
puts calculate_product_odd(2) == nil #=> true, because no element of empty array are odd
puts calculate_product_odd(1) == 1 #=> true...(though product is binary operator...had to interpret it otherwise given the provided driver code)
puts calculate_product_odd([1.5]) rescue (puts $!.message == 'Requires integer array') #=> true if float returns defined error message
puts calculate_product_odd(['caroline']) rescue (puts $!.message == 'Requires integer array') #=> true if single string array returns defined error message


# EXERCISE 4
=begin
#format_name:
takes a hash argument, name, and uses string interpolation to look up the name hash values keys :first and :last. The
method returns a formatted string.
Example:
  A variable passed as name could include hash key/values {:last => 'artz', :first => 'caroline'}
  and would return (not print) "artz, caroline"
  note: use of keyword return here is unnecessary; last evaluated expression => implicit return

#display_name:
takes a hash argument, name, then prints the output as a result of calling #format_name on its input argument, name.
This might represent a scenario where format name is a private method only accesseed internally.
=end


# EXERCISE 5 **really wasn't sure which solution was 'better'; would love feedback on why one vs. the other.
# I went with the mulitple array method because I find it clearer, but I wonder if it would be slow/inefficient at a larger scale.

#ALTERNATIVE SOLUTION
# def find_missing_number(number_string)
#   int_array = number_string.split(', ').collect { |s| s.to_i }
#   prepend_array = int_array.unshift(0)

#   (prepend_array.last != 10000) ? 10000 : prepend_array.find_index do |int|
#     int != prepend_array[int]
#   end
# end

def find_missing_number(number_string)

  missing_array = number_string.split(', ').collect { |s| s.to_i }
  complete_array = (1..10000)

  complete_array.zip(missing_array).detect do |a, b|
    return a if a != b
  end
end

# What are the most difficult missing numbers to detect?
# With my alternative solution above, the endpoints were more 'difficult' to account for; 
# however, with the 2 array solution, I don't think any missing number is more or less difficult to detect
string_missing_7     = (1..10000).reject { |x| x == 7 }.join(', ')
string_missing_4567  = (1..10000).reject { |x| x == 4567 }.join(', ')
string_missing_9998  = (1..10000).reject { |x| x == 9998 }.join(', ')
string_missing_9999  = (1..10000).reject { |x| x == 9999 }.join(', ')
string_missing_1     = (1..10000).reject { |x| x == 1 }.join(', ')
string_missing_10000 = (1..10000).reject { |x| x == 10000 }.join(', ')

puts find_missing_number(string_missing_7) == 7 #=> true if detects missing 7
puts find_missing_number(string_missing_4567) == 4567 #=> true if detects missing 4567
puts find_missing_number(string_missing_9998) == 9998 #=> true if detects missing 9998
puts find_missing_number(string_missing_9999) == 9999 #=> true if detects missing 9999
puts find_missing_number(string_missing_1) == 1 #=> true if detects missing 1
puts find_missing_number(string_missing_10000) == 10000 #=> true if detects missing 10000


# EXERCISE 6
def valid_string?(string)
  brackets = string.gsub(/[^\[\]{}\(\)]/, '')

  until /\(\)|\{\}|\[\]/.match(brackets) == nil
    brackets.gsub!(/\(\)|\{\}|\[\]/, '')
  end

  brackets == '' ? true : false
end

puts valid_string?('[ ]') == true #=> returns true, brackets close
puts valid_string?('[  ') == false #=> returns false, open bracket
puts valid_string?('[ ( text ) {} ]') == true #=> returns true, brackets close
puts valid_string?('[ ( text { ) } ]') == false #=> returns false, improper nesting
puts valid_string?('enum.meth!(args) {|x, y| block (x-(y-6)) ? "true for #{x} & #{y}" : puts "false for #{x} & #{y}"}') == true #=> returns true, brackets close
puts valid_string?('{} / {(([])[(1[(6))]-2])}/text') == false #=> returns false, improper nesting
puts valid_string?('asdfasdfa') == true #=> returns true, no open brackets
puts valid_string?('asdfasf)dfa') == false #=> returns false, open bracket


# Exercise 7
class House
  # included :minimum_temp and :maximum_temp attr_readers for test code purposes,
  # wouldn't necessarily need them as the problem is stated, otherwise.
  attr_reader :current_temp, :minimum_temp, :maximum_temp, :heater_on, :ac_on

  def initialize(cur_temp, min_temp, max_temp)
    @current_temp = cur_temp
    @minimum_temp = min_temp
    @maximum_temp = max_temp
    @heater_on = false
    @ac_on = false
  end

  def toggle_heater
    toggle_ac if @ac_on
    @heater_on = !@heater_on
  end

  def toggle_ac
    toggle_heater if @heater_on
    @ac_on = !@ac_on
  end

  def update_temp!
    if @heater_on
      @current_temp += 1
      if @current_temp > @maximum_temp
        toggle_ac
      end
    elsif @ac_on
      @current_temp -= 2
      if @current_temp < @minimum_temp
        toggle_heater
      end
    end
  end

end

my_house = House.new(75, 63, 80)
your_house = House.new(78, 73, 82) # ok, grandpa
fail_house = House.new(76, 88) rescue (puts $!.message == 'wrong number of arguments (2 for 3)') #=> true if throw ArgumentError for too few args
greedy_house = House.new(55, 45, 32, 11) rescue (puts $!.message == 'wrong number of arguments (4 for 3)') #=> true if throw ArgumentError for too many args

# get current temps and confirm definitions
p my_house.current_temp == 75 #=> true if my house current temp is 75
p my_house.minimum_temp == 63 #=> true if my house min temp is 63
p my_house.maximum_temp == 80 #=> true if my house max temp is 80
p my_house.ac_on == false #=> true if my house instantiated with AC off
p my_house.heater_on == false #=> true if my house instantiated with heat off

p your_house.current_temp == 78 #=> true if your house current temp is 78
p your_house.minimum_temp == 73 #=> true if your house min temp is 73
p your_house.maximum_temp == 82 #=> true if your house max temp is 82
p your_house.ac_on == false #=> true if your house instantiated with AC off
p your_house.heater_on == false #=> true if your house instantiated with heat off

my_house.toggle_heater
p my_house.heater_on == true #=> true if heat is on at my house

your_house.toggle_ac
p your_house.ac_on == true #=> true if ac is on at your house

my_house.update_temp!
your_house.update_temp!

p my_house.current_temp == 76 #=> true if current temp is 76 at my house
p your_house.current_temp == 76 #=> true if current temp is 76 at your house

my_house.toggle_ac
p my_house.heater_on == false #=> true if heater off at my house
p my_house.ac_on == true #=> true if ac on at my house

your_house.toggle_heater
p your_house.ac_on == false #=> true if ac off at your house
p your_house.heater_on == true #=> true if heater on at your house

7.times {my_house.update_temp!}
7.times {your_house.update_temp!}

p my_house.current_temp == 62 #=> true if my house current temp is 62 [MIN TEMP = 63]
p your_house.current_temp == 83 #=> true if your house current temp is 83 [MAX TEMP = 82]

p my_house.heater_on == true #=> true if my house switched heater on at min temp
p my_house.ac_on == false #=> true if my house switched ac off at min temp

p your_house.ac_on == true #=> true if your house switched ac on at max temp
p your_house.heater_on == false #=> true if your house switched heater off at max temp

my_house.update_temp!
your_house.update_temp!

p my_house.current_temp == 63 #=> true if my house current temp is now increasing by 1 degree
p your_house.current_temp == 81 #=> true if your house current temp is decreasing by 2 degrees


# EXERCISE 8
=begin
  Reverse Polish Notation Calculator: Andrew Young's solution

    class RPNCalculator
      def evaluate(expr)
        stack = []
        array = expr.split(' ')
        operators = ['+', '-', '*', '/']
        array.each do |token|
          unless operators.include?(token)
            stack.push(token)
          else
            n = stack.pop
            stack.push(eval(stack.pop + token + n).to_s)
          end
        end
        stack[0].to_i
      end
    end

  I picked Andrew's solution because I find it easy to understand--almost like its written in english.
  While it may not be the solution with the shortest code, that shouldn't be our goal- in favor of clarity and
  readability. I definitel think Andrew accomplished both eligantly.


  Reverse Words: Nick Eich's Solution

    def reverse_words(str)
      str.split(" ").reverse.join(" ").reverse
    end

   A few people had this solution, I just listed one. This is a great solution because it is clear and concise.
   Sometimes it is possible to write a solution that us beginners applaud for being 'short' while still conforming
   to good coding standards.


  Fibonacci Number: Mohammad Abdeljalil's solution

    def is_fibonacci?(i)
      start, after = 0, 1
      while after <= i
        start, after = after, start + after
      end
      i == start
    end

  I picked Mohammad's solution because it's clever and it accomplishes exasctly what I was trying to accomplish in mine...but
  wayyyy better--makes it look so easy! I really like this code; the variables are named such that I can read it and visualize
  exactly what's going on--very smart. Way to go Mohammad!
=end
