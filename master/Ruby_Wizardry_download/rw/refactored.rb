def describe_number(number)
  number ||= 42
  puts "My number is: #{number}"
  sign(number)
end

def sign(number)
  case
  when number > 0
    'Positive'
  when number < 0
    'Negative'
  else
    'Zero'
  end
end
