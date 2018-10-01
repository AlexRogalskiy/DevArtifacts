def all_about_my_number(number)
  if number.nil?
    number = 42
  end

  puts "My number is: #{number}"

  if number > 0 == true
    return 'Positive'
  elsif number < 0 == true
    return 'Negative'
  else
    return 'Zero'
  end
end
