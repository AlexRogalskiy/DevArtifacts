########################IDENTIFY WHAT EACH LINE OF CODE IS DOING####################

def north_korean_cipher(coded_message)
  input = coded_message.downcase.split("") #any uppercase chars to lowercase;
                    #splits the string at each char and
                    #returns an array of chars.
  decoded_sentence = [] #creates empty array to push our deciphered message chars into
  cipher = {"e" => "a", #deciphers the alphabetical chars into NK key => EN value
            "f" => "b",
            "g" => "c",
            "h" => "d",
            "i" => "e",
            "j" => "f",
            "k" => "g",
            "l" => "h",
            "m" => "i",
            "n" => "j",
            "o" => "k",
            "p" => "l",
            "q" => "m",
            "r" => "n",
            "s" => "o",
            "t" => "p",
            "u" => "q",
            "v" => "r",
            "w" => "s",
            "x" => "t",
            "y" => "u",
            "z" => "v",
            "a" => "w",
            "b" => "x",
            "c" => "y",
            "d" => "z"}

  input.each do |x| # Outer most loop: iterates across array of each char from the coded message
    found_match = false  # Sets a control condition for middle loop; ensures a way to break from the middle loop
    cipher.each_key do |y| # for each iteration of a character from the coded input (outer loop), iterate across the cipher keys to check...
      if x == y  # If the input character matches one of the keys in the cipher for the alpha chars,
        puts "I am comparing x and y. X is #{x} and Y is #{y}." #print this statement
        decoded_sentence << cipher[y] #push the value corresponding to the cipher key into the decoded sentence array
        found_match = true #condition allows to  skip executing code for when match not found
        break  # break from the inner loop, proceed to test for if not found match
      elsif x == "@" || x == "#" || x == "$" || x == "%"|| x == "^" || x == "&"|| x =="*" #when input didn't match cipher char,
        decoded_sentence << " "# proceed; if the input char matches one of these chars, push a space to the decoded sentence array
        found_match = true #condition allows to skip executing code for when match not found
        break # break from inner loop, proceed to test for if not found match
      elsif (0..9).to_a.include?(x) # when didn't match the above, proceed; if find match in array of numbers 0-9
        decoded_sentence << x # push the number to the decoded sentence array
        found_match = true #condition allows to skip executing code for when match not found
        break # break from inner loop, proceed to test for if not found match
      end #end inner most loop. found_match = false
    end # end first middle loop cipher.each_key
    if not found_match  #  after completing or breaking from if/elsif/else inner loop, check found_match status;
      decoded_sentence << x #when match not found, push char to decoded_sentence array
    end #end match not found
  end #end outer loop which iterates over each character in coded message

  decoded_sentence = decoded_sentence.join("") #join elements from array of decoded sentence charas to string

  if decoded_sentence.match(/\d+/) #test if string has one or more numbers, greedy
    decoded_sentence.gsub!(/\d+/) { |num| num.to_i / 100 } #if yes, convert to integer and swap it out for its value divided by 100
  end #end decoded_sentence.match
  return decoded_sentence # return input message, decoded
end #end north_korean_cipher()

###################################FIRST REFACTOR###################################

def create_cipher(rotation)
  decoded = ('a'..'z').to_a
  coded = decoded.rotate(rotation)
  return Hash[coded.zip(decoded)]
end

def north_korean_cipher(coded_msg, r=4)
  input = coded_msg.downcase.split("")
  decoded_msg = []
  cipher = create_cipher(r)

  input.each do |x|
    case
    when x =~ /(\@|\#|\$|\%|\^|\&|\*)/
      decoded_msg << " "
    when x =~ /\d/
      decoded_msg << x
    when cipher.each_key.any? {|y| y == x}
      decoded_msg << cipher[x]
    else
      decoded_msg << x
    end
  end

  decoded_msg = decoded_msg.join("")
  return decoded_msg.gsub(/\d+/) { |num| num.to_i / 100 }
end

###################################FINAL: SECOND REFACTOR###########################

def north_korean_cipher(coded_message, r=4)
    alphas=('a'..'z').to_a*2
    exaggerated_msg = coded_message.downcase.tr('a-z', alphas[26-r..52-r].join).gsub(/(\@|\#|\$|\%|\^|\&|\*)/m, " ")
    exaggerated_msg.gsub(/\d+/) { |num| num.to_i / 100 }
end

###################################DRIVER CODE######################################

p north_korean_cipher("m^aerx%e&gsoi!") == "i want a coke!"
p north_korean_cipher("syv@tistpi$iex#xli*qswx*hipmgmsyw*erh*ryxvmxmsyw%jsshw^jvsq^syv#1000000#tvsjmxefpi$jevqw.") == "our people eat the most delicious and nutritious foods from our 10000 profitable farms."
p north_korean_cipher("syv%ryoiw#evi#liph^xskixliv@fc^kveti-jpezsvih@xsjjii.*hsr'x%xipp&xli#yw!") == "our nukes are held together by grape-flavored toffee. don't tell the us!"

###########BONUS: CIPHER METHOD TO DO ENCRYPTION & DRIVER CODE######################

def nk_cipher_encrypt(message, r=4)
    sign = ['@','#','$','%','^','&','*']
    alphas=('a'..'z').to_a*2
    exaggerated = message.downcase.tr('a-z', alphas[r..26+r].join)
    
    while exaggerated =~ /\s/
      exaggerated.sub!(/[^\w[:punct:]]/, sign[rand(7)])
    end
    exaggerated.gsub(/\d+/) { |num| (num.to_i * 100).to_s }
end

#put my own message into nk_cipher_encrypt and validated output by decripting via
#north_korean_cipher
p nk_cipher_encrypt("how can we be expected to teach children how to read...if they can't even fit inside the building?") 
  #=> "lsa%ger%ai@fi%ibtigxih#xs@xiegl*glmphvir@lsa#xs@vieh...mj&xlic&ger'x#izir*jmx&mrwmhi&xli&fymphmrk?" 
p north_korean_cipher("lsa%ger%ai@fi%ibtigxih#xs@xiegl*glmphvir@lsa#xs@vieh...mj&xlic&ger'x#izir*jmx&mrwmhi&xli&fymphmrk?") 
  #==> "how can we be expected to teach children how to read...if they can't even fit inside the building?"

###################################REFLECTION#######################################

# I spent a LOT of time on this problem-both in small groups, pairs, and alone. There are obviously
# many ways to achieve the desired outcome, both more and less similiar to the oringinal code/logic.
# I reviewed an article prior working on this challenge that clued me in on the #rotate Array and
# #zip create Hash methods. This approach vastly simplified the task of creating the cipher and
# allows for the inclusion of an (optional) rotation parameter and extend the utility of the
# method/program in the event the shift changed from 4. The code struck me as more of a program than
# a single method; it's quite long and is something that could definitely be made modular. For my
# first refacoring, I split the cipher into two methods, one creating the actual cipher and the
# other calling the cipher creation method and returning the decoded message.

#FIRST REFACTOR: The biggest challenge I experienced during my first refactoring was the nested
#conditionals and loops that test/match/push coded characters => decoded chars. I wanted to
#implement a case statement, as it seemed like an approach that might simplify things and allow me
#to remove some of those repetetive tests found match tests-it wasn't easy, but the logic eventually
#became clear and I was able to satisfy the necessary conditions to push the original character into
#the decoded message array ONLY AFTER exhaustive iteration over the cipher without a match.

#SECOND REFACTOR: I was convinced there must be a much shorter and simplier approach to solving this
#problem. After a helpful brainstorming session with some fellow boots, I found a somewhat related
#article that supported the ideas we were playing with. I ran with the approach which doesn't
#invovle creating a cipher hash and instead creates a single array of the alphabet characters a-z
#two times (i.e., like : ['a', 'b', 'c'..'z', 'a', 'b', 'c'..'z']). Again using an optional rotation
#parameter, defaulting to 4 for our purposes, I could join a string from the alphabet array at the
#oppriate offset and usethe tr method to replace the alphabetical characters directly within the
#coded_message string. Regex solves the additional substitution objectives relatively easily. Yay :)
