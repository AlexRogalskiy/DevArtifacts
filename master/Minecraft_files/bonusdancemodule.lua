-- Bonus Activity: Dance Module

function spinRight()
  for i = 1, 4 do
    turtle.turnRight()
  end
end

function spinLeft()
  for i = 1, 4 do
    turtle.turnLeft()
  end
end


function hop()
  turtle.up()
  turtle.down()
end

function moonwalk()
  turtle.turnRight()
  turtle.turnRight()
  for i = 1, 4 do
    turtle.back()
  end
  spinRight()
  hop()
end

