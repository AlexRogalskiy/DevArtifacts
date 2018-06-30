# PSEUDOCODE

# INPUT 	rows: integer (0 or positive) for number of rows (/columns)
# OUPUT		times table: printed times table with the input number of rows/columns
# STEPS
# 			SET a collection with elements 1..rows
# 			SET counter to 1
# 			WHILE counter is less than/equal to rows
# 				ITERATE over elements of collection
# 					MULTIPLY element by counter
# 					replace element with result
# 				END iterator
#				JOIN collection with space delimiter 
# 				PRINT string on a single line
# 				INCREMENT counter by 1
# 			END while

#



# INITIAL CODE:
def times_table(rows)
  if rows > 0
    array = (1..rows).to_a

    i = 1
    while i <= rows
      puts array.map {|e| "#{e*i} "}.join(' ')
      i += 1
    end
  end
end


# REFACTORED CODE:

def times_table(rows)
    array = (1..rows).to_a
    i = 1
    while i <= rows
      puts array.map {|e| " %3d" % (e * i)}.join(' ')
      i += 1
    end
end


# INCLUDE REFLECTION HERE:
# I tend to jump to using arrays quite often. I definitely think this problem can be solved without 
# pushing the rows to an integer array, but I decided to go with my initial approach and I think it
# turned out alright. Although not a requirement, I wanted to learn how ruby implements printing 
# formatted strings--I knew how to do it in Java and wasn't sure if there was somethign similar. Although
# it seems a bit less robust but the same type of flags/concepts. It took me a few atempts to figure out
# how to implement it with my code but i got it working and my times table looks much prettier :)
