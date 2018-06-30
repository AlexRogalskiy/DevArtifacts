
#######################################PSEUDOCODE###################################

# INPUT: a positive integer
# OUPUT: boolean true/false if it is a fibonacci number
# generate fib numbers less than or equal to input
# test whether input one of the generated fib numbers
# return boolean true if is fib number
# return boolean false if not a fib number


###################################INITIAL CODE#####################################

def is_fibonacci?(i)
  fibs = [0, 1]
  if (i != 0) && (i !=1 )
    while fibs.last < i
      fibs <<  fibs.inject {|x, y| x+y}
      fibs.shift
      if i == fibs.last
        return true
      end
    end
    return false
  else true
  end
end

####################################REFACTORED CODE#################################

def is_fibonacci?(i)
  fibs = [1, 0] #start with array ordered 1 then 0 to account for fibs.last == 0 => true 
  while i > fibs.last                                   #without affecting fibonacci sums
    x, y = fibs.pop(2)  #pop off and assign vars x and y to the last two elementss of fibs array
    fibs.push(x, y, x + y)  #push those right back in the front followed by their sum
  end #looping until results in 3 element array where the final element must be i IFF i is fibonacci

  #true if non-negative integer i is the last element OR it wasn't greater than 0 and thus was equal 0
  return true if (i == fibs.last)
  false #otherwise, false
end

###################################DRIVER CODE######################################
def random_fibonacci
   [0,1,1,2,3,5,8,13,21,34,55,89,144,233,377,610,987,1597,2584,4181,6765,10946].sample
end

p is_fibonacci?(8670007398507948658051921) == true
p is_fibonacci?(random_fibonacci+100) == false
p is_fibonacci?(927372692193078999171) == false
p is_fibonacci?(0) == true

###################################REFLECTION#######################################

# I spent a lot of time on this problem and the bonus fib method. I can see
# there are a lot of ways to solve this problem, some faster or more clear than
# others. I noticed that a lof of submitted solutions did not pass a test for
# returning true for testing if 0 is a fibonacci number (when random selection
# of fib number didn't sample `0`, rspecs wouldn't error). So, I was trying to
# find a good way to include 0. My first couple solutions to the probelm involed
# either a larger loop testing the condition at the start (initial code) or for
# my refactored code, initially I had an OR expression added in the return true
# to include the 0 case. Finally, I thought to reverse the initial array,
# effectively making 0 the last element in the array at the start without
# affecting the sums going forward. This way, the test for true if fib number is
# last number in the array will evaluate to true when i=0.
