--[[Dance program by Al Sweigart
Make the turtle dance!]]

print('Time to dance!')

-- Turtle starts dancing
turtle.forward()
turtle.back()
turtle.turnRight()
turtle.forward()
turtle.back()
turtle.back()
turtle.turnLeft()
turtle.turnLeft()
turtle.back()
turtle.turnRight()

-- Turtle spins around
for i = 1, 4 do
  turtle.turnRight()
end

turtle.up()
turtle.down()
print('Done.')