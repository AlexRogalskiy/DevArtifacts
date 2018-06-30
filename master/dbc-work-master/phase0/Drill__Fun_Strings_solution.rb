###FIRST ATTEMPT
def fun_stringitize(word)
  string_array = word.split('')
  string_array.each_with_index do |letter, index|
    if (index.odd?)
      letter.upcase!
    end
  end
  string_array.join().reverse
end




###REFECTORED
def fun_stringitize(word)
  word.gsub(/(\S)(\S)/) {$1 + $2.upcase}.reverse
end


###BONUS
class String
  def fun_stringitize!
    self.gsub!(/(\S)(\S)/) {$1 + $2.upcase}.reverse!
  end
end


###DRIVER CODE/TESTS
string = 'apples'
puts fun_stringitize(string) == 'SeLpPa'
puts string == 'apples'


puts string.fun_stringitize! == 'SeLpPa'
puts string == 'SeLpPa'