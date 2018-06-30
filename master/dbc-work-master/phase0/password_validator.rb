# PSEUDOCODE
# Please write your pseudocode here and keep it commented
# INPUT: string
# OUTPUT: message indicating valid else failed password and violations
# What are the steps to solve the problem?  Write them out in plain english as best you can.
# make sure passed argument is a string
# test the password against validity rules
# return or print appropriate valid/invalid + error message

# NOTE: my assumption is that the invalid message should always indicate ALL violated requirements

# INITIAL CODE (I merged my refactored and original code into one because the driver code had to change a lot)
def check_password(password)
  raise ArgumentError, 'Error. Requires string input.' unless password.respond_to?(:split) # check if input is string
  invalids = []

  invalids << '  be at least 6 characters' if password.length < 6
  invalids << '  be no more than 20 characters' if password.length > 20
  invalids << '  contain at least one uppercase letter' unless !!(password =~ /[A-Z]+/)
  invalids << '  contain at least one digit OR special character: ! @ # $ % & * + : ?' unless !!(password =~ /[0-9]|[!@#\$%&\*\+:\?]/)
  invalids << '  not contain invalid characters' if !!(password =~ /[^ !@#\$%&\*\+:\?[:alnum:]]/)

  return 'Valid Password' if invalids.empty?
  "Error. Passwords must:\n" + invalids.join("\n")
end


# DRIVER CODE
# true if string array as input returns defined error message
puts check_password(['ruby']) rescue (puts $!.message == 'Error. Requires string input.')

# true if returns messages for invalid length-short and missing digit/special char
puts check_password('rddRy') ==
'Error. Passwords must:
  be at least 6 characters
  contain at least one digit OR special character: ! @ # $ % & * + : ?'

# true if returns msg for missing uppercase letter and invalid char
puts check_password('rub]ies!') ==
'Error. Passwords must:
  contain at least one uppercase letter
  not contain invalid characters'

# true if recognizes valid password format
puts check_password('my name is Caroline!') == 'Valid Password'

# true if returns msg for invalid length-over 20
puts check_password('your name is NOT Caroline!') ==
'Error. Passwords must:
  be no more than 20 characters'

# INCLUDE REFLECTION HERE:
# For some reason this challenge seems more difficult than it needs to be--at least the way(s) I could
# think of to go about it. I'm very curious to see how other people solved it because I really don't
# think my approach is optimal. But I'm also not sure if my interpretation of printing a message for every
# requirement violation is common vs breaking and returning the first rule violated when there's at least 
# one violation. I like this problem though, it made me think quite a bit and also research/get more familiar
# with regexp methods even if I didn't end up using them in the end.

# I came back to this after checking out others and realizing I didn't account for inclusion of invalid characters
# e.g., special characters beyond those that are allowed). I created a new case for this to push/display messages. 
