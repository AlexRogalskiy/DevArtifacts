require 'sqlite3'


$db = SQLite3::Database.open 'congress_poll_results.db'

def print_arizona_reps
  puts 'AZ REPRESENTATIVES'
  az_reps = $db.execute("SELECT name FROM congress_members WHERE location = 'AZ'")
  az_reps.each { |rep| puts rep }
end

# Print out the number of years served as well as the name of the longest running reps
# output should look like:  Rep. C. W. Bill Young - 41 years

#BOUND FOR GAURDING AGAINST SQL INJECTION
def print_longest_serving_reps(minimum_years)
  puts 'LONGEST SERVING REPRESENTATIVES (greater than 35 years)'
  longest_reps = $db.execute("SELECT name, years_in_congress FROM congress_members WHERE years_in_congress > ?",[minimum_years])
  longest_reps.each {|rep, years| puts "#{rep} - #{years} years"}
end

# Need to be able to pass the grade level as an argument, look in schema for "grade_current" column

#BOUND FOR GAURDING AGAINST SQL INJECTION
def print_lowest_grade_level_speakers(maximum_level)
  puts 'LOWEST GRADE LEVEL SPEAKERS (less than < 8th grade)'
  lowest_grade_level = $db.execute("SELECT name, ROUND(grade_current, 2) FROM congress_members WHERE grade_current < ?",[maximum_level])
  lowest_grade_level.each {|rep, level| puts "#{rep} - #{level} grade level"}
end

#  Make a method to print the following states representatives as well:
# (New Jersey, New York, Maine, Florida, and Alaska)
# Version 1 pulling all data for target fields into array and filtering target data from there
def print_state_reps(*states)
  puts 'REPRESENTATIVES BY STATE'
  state_reps = $db.execute('SELECT name, location FROM congress_members')
  states.each do |state|
    puts "#{state} REPRESENTATIVES"
    state_reps.each do |rep, st|
      if st == state
        puts rep
      end
    end
    puts ''
  end
end

# Version 2 with binding parameters to guard against SQL injection
def print_state_reps1(*states)
  puts 'REPRESENTATIVES BY STATE'
  states.each do |state|
    puts "#{state} REPRESENTATIVES"
    state_reps = $db.execute("SELECT name FROM congress_members WHERE location = ?",[state])
    state_reps.each {|st| puts st}
    puts ''
  end
end

#BONUSES
# Create a listing of all of the Politicians and the number of votes they received
# output should look like:  Sen. John McCain - 7,323 votes
def print_rep_votes
  puts 'VOTES BY POLITICIAN'
  number_votes = $db.execute("SELECT c.name, COUNT(*)AS number_votes FROM congress_members c,
votes v WHERE c.id = v.politician_id GROUP BY c.name")
  number_votes.each {|rep, votes| puts "#{rep} - #{votes} votes"}
end

# Create a listing of each Politician and the voter that voted for them
# output should include the senators name, then a long list of voters separated by a comma
def print_rep_voters
  puts 'VOTERS BY POLITICIAN'
  rep_concat_voter = $db.execute("SELECT c.name, (r.first_name || ' ' || r.last_name) FROM congress_members c,
votes v, voters r WHERE (c.id = v.politician_id) AND (r.id = v.voter_id) ORDER BY c.name")

  rep_voters = Hash[rep_concat_voter.chunk{|x| x[0]}.to_a]
  rep_voters.each_pair do |key, value|
    print "#{key}: "
    puts (value.each {|x| x.delete_at(0)}).join(', ')
  end
end

def print_separator
  puts
  puts "------------------------------------------------------------------------------"
  puts
end

print_arizona_reps
print_separator

#  Print out the number of years served as well as the name of the longest running reps
# output should look like:  Rep. C. W. Bill Young - 41 years
print_longest_serving_reps(35)
print_separator

# Need to be able to pass the grade level as an argument, look in schema for "grade_current" column
print_lowest_grade_level_speakers(8)
print_separator

#  Make a method to print the following states representatives as well:
# (New Jersey, New York, Maine, Florida, and Alaska)
# Two versions:
print_state_reps('NJ','NY', 'ME', 'FL', 'AK')
print_state_reps1('NJ','NY', 'ME', 'FL', 'AK')

print_separator

##### BONUS #######
#1. (bonus) - Stop SQL injection attacks!  Statmaster learned that interpolation of variables in SQL
#   statements leaves some security vulnerabilities.  Use the google to figure out how to protect from
#   this type of attack.
#   BIND PARAMETERS; EXAMPLES:
#     db.execute( "INSERT INTO Products ( stockID, Name ) VALUES ( ?, ? )", [id, name])
#     db.execute ("SELECT name FROM congress_members WHERE location = ?",[state])

# 2. Create a listing of all of the Politicians and the number of votes they received
#    output should look like:  Sen. John McCain - 7,323 votes
print_rep_votes
print_separator

# 3. Create a listing of each Politician and the voter that voted for them
#    output should include the senators name, then a long list of voters separated by a comma
print_rep_voters