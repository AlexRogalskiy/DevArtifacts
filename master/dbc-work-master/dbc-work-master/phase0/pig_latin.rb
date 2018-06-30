def pig_latin(input)
  input = input.join(' ')
  words = input.split /\s|([?!.,])/
  words.map! do |word|
    if word[0] =~ /[aeiou]/i
      word
    else
      match = word.slice!(/([^aeiou])/,1)
      word.downcase + match.downcase + 'ay'
    end
  end.join(' ')
end

puts pig_latin(ARGV)

# terminal:
# ruby pig_latin.rb this is cool #=> histay is oolcay
