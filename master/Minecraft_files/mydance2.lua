--[[ A Better Dance program by Al Sweigart
Make the turtle dance better! ]]

local isUp = false
local isBack = false
local danceMove
print('Hold Ctrl-T to stop dancing.')
while true do
  danceMove = math.random(1, 5)

  if danceMove == 1 then
    -- turn left
    print('Turn to the left!')
    turtle.turnLeft()

  elseif danceMove == 2 then
    -- turn right
    print('Turn to the right!')
    turtle.turnRight()

  elseif danceMove == 3 then
    -- forward/back moves
    if isBack then
      print('Move forward!')
      turtle.forward()
      isBack = false
    else
      print('Move back!')
      turtle.back()
      isBack = true
    end

  elseif danceMove == 4 then
    -- up/down moves
    if isUp then
      print('Get down!')
      turtle.down()
      isUp = false
    else
      print('Get up!')
      turtle.up()
      isUp = true
    end

  else
    -- spin around
    print('Spin!')
    for i = 1, 4 do
      turtle.turnLeft()
    end
  end
end
