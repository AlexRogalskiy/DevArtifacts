
#######################################PSEUDOCODE###################################

# INPUT: a string
# OUPUT & PSEUDOCODE
# Contains SSN =>     OUTPUT: Return boolean true/false
#                     Test string for chars in SSN format
# Return SSN =>       OUTPUT: Return SSN extracted from input, as string
#                     Call Contains SSN method-test if a SSN in string
#                     If contains SSN, extract and return.
#                     Otherwise, return nil
# Return all SSNs =>  OUTPUT: Return string array of all SSNs in input string, else empty
#                     Create an array to hold any SSNs in string
#                     Check for SSNs in string
#                     Push any formatted SSNs to array and return 
# Obfuscate SSNs =>   OUTPUT: Return input string with any SSNs obfuscated to XXX-XX-1234 
#                     Check string for any SSNs
#                     Replace first 5 number characters with X and return string
# Format SSNs =>      OUTPUT: Return input string; if any SSNs, formated as 123-45-6789
#                     Search string for any format SSN
#                     Extract each SSN's number char groups 
#                     join them with appropriate - 
#                     push formatted SSNs to array, join to string and return

###################################INITIAL CODE#####################################

# Determine whether a string contains a Social Security number.
def has_ssn?(string)
  if string =~ /(\d{3})-(\d{2})-(\d{4})/
    true
  else
    false
  end
end

# Return the Social Security number from a string.
def grab_ssn(string)
  if has_ssn?(string) == true
    ssns = []
    ssn = string.scan(/(\d{3})-(\d{2})-(\d{4})/ )
    ssn.to_a.map do |m|
      ssns << m.join("-").to_s
    end
    ssns.to_a.join(', ')
  end
end

# Return all of the Social Security numbers from a string.
def grab_all_ssns(string)
  matched_ssns = []
  ssns = string.scan(/(\d{3})-(\d{2})-(\d{4})/ )
  ssns.to_a.each do |m|
    matched_ssns << m.join("-")
  end
  matched_ssns
end
# Obfuscate all of the Social Security numbers in a string. Example: XXX-XX-4430.
def hide_all_ssns(string)
  return string.gsub(/(\d{3})-(\d{2})-(\d{4})/, 'XXX-XX-\3')
end

# Ensure all of the Social Security numbers use dashes for delimiters.
def format_ssns(string)
  matched_ssns = []
  ssns =  string.scan(/(\d{3})*\D??(\d{2})*\D??(\d{4})/)
  ssns.to_a.each do |m|
    matched_ssns << m.join("-")
  end
  if matched_ssns.join(', ') =~ /(\d{3})-(\d{2})-(\d{4})/
    return matched_ssns.join(', ')
  else return string
  end
end

####################################REFACTORED CODE#################################

# Determine whether a string contains a Social Security number.
def has_ssn?(string)
   /\d{3}\-\d{2}\-\d{4}/x.match(string) ? true : false
end

# Return the Social Security number from a string.
def grab_ssn(string)
  string[/\d{3}\-\d{2}\-\d{4}/x]
end

# Return all of the Social Security numbers from a string.
def grab_all_ssns(string)
  string.scan(/\d{3}\-\d{2}\-\d{4}/x)
end

# Obfuscate all of the Social Security numbers in a string. Example: XXX-XX-4430.
def hide_all_ssns(string)
  string.gsub(/\d{3}-\d{2}/, "XXX-XX")
end

# Ensure all of the Social Security numbers use dashes for delimiters.
def format_ssns(string)
  string.gsub(/(\d{3})(\D?)(\d{2})(\D?)(\d{4})/, '\1-\3-\5') #inclues matching '432 23 2342' format
end

###################################DRIVER CODE######################################

puts has_ssn?("please don't share this: 234-60-1422") == true

puts has_ssn?("please confirm your identity: XXX-XX-1422") == false

puts grab_ssn("please don't share this: 234-60-1422") == "234-60-1422"

puts grab_ssn("please confirm your identity: XXX-XX-1422") == nil

puts grab_all_ssns("234-60-1422, 350-80-0744, 013-60-8762") == ["234-60-1422", "350-80-0744", "013-60-8762"]

puts grab_all_ssns("please confirm your identity: XXX-XX-1422") == []

puts hide_all_ssns("234-60-1422, 350-80-0744, 013-60-8762") == "XXX-XX-1422, XXX-XX-0744, XXX-XX-8762"

puts hide_all_ssns("please confirm your identity: XXX-XX-1422") == "please confirm your identity: XXX-XX-1422"

puts format_ssns("234601422, 350.80.0744, 013-60-8762") == "234-60-1422, 350-80-0744, 013-60-8762"

puts format_ssns("please confirm your identity: 44211422") == "please confirm your identity: 44211422"

###################################REFLECTION#######################################

# Regex has always intimidated me. In the past, there have been various instances where I could see
# that a task would be made significantly simplier using regex, but my halfassed attempts to
# implement were unsuccessful and frustrating. I was glad to have the less optional opportunity to
# learn regex and my distaste quickly faded as I saw the extent of its power. I'm excited to further
# expand my ability to identify and evaluate the different ways to acheieve the match or
# match/replace task at hand. Regex assertions can be helpful but I haven't yet had a ton of
# experience implementing them. I also would like to learn about benchmarks, processing time, etc.
# and be able to appropriately select the best method based on the needs of the program.
