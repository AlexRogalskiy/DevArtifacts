--[[Stone Brick Factory program by Al Sweigart
Gets stone from furnace to craft stone bricks, turtle 2 of 2]]

print('Starting stone brick crafting program...')

local NUM_FURNACES = 5
local brickCount = 0
while true do
  -- check turtle's fuel
  if turtle.getFuelLevel() < (2 * NUM_FURNACES) then
    error('Turtle needs more fuel!')
  end

  turtle.select(1)  -- put stone in slot 1

  -- start collecting stone from furnaces
  for i = 1, NUM_FURNACES do
    turtle.suckUp(64 - turtle.getItemCount(1))  -- get stone from furnace
    if turtle.getItemCount(1) == 64 then
      break  -- stop once there are 64 stone blocks
    end
    if i ~= NUM_FURNACES then
      turtle.back()  -- move to next furnace
    end
  end

  -- craft stone bricks
  if turtle.getItemCount(1) == 64 then
    turtle.transferTo(2, 16)  -- put in slot 2
    turtle.transferTo(5, 16)  -- put in slot 5
    turtle.transferTo(6, 16)  -- put in slot 6
    turtle.select(16) -- stone bricks to go in slot 16
    turtle.craft() -- craft stone bricks
    brickCount = brickCount + 64
    print('Total stone bricks: ' .. brickCount)
  else
    print('Not enough stone yet. Sleeping...')
    os.sleep(120)  -- wait for 2 minutes
  end

  -- move back to chest (by first furnace)
  for i = 1, NUM_FURNACES - 1 do
    turtle.forward()
  end
  turtle.turnLeft()  -- face chest
  turtle.select(16)  -- select stone bricks
  turtle.drop() -- put stone bricks into chest
  turtle.turnRight()  -- face generator again
end
