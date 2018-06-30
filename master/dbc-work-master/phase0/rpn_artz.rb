class RPNCalculator
  def evaluate(expression)
    input_array = expression.split(' ')
    stack_array = []

    input_array.each do |element|
      case element
        when /\d+/ then stack_array << element.to_i
        when '+' then stack_array << (stack_array.pop + stack_array.pop)
        when '*' then stack_array << (stack_array.pop * stack_array.pop)
        when '-' then stack_array << (-stack_array.pop + stack_array.pop)
      end
    end
    return stack_array[0]
  end
end