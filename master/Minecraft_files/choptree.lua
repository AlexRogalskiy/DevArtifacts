--[[Tree Chopping program by Al Sweigart
Chops down the tree in front of turtle.]]

if not turtle.detect() then
  error('Could not find tree!')
end

print('Chopping tree...')

if not turtle.dig() then -- chop base of tree
  error('Turtle needs a digging tool!')
end

turtle.forward() -- move under tree
while turtle.compareUp() do
  -- keep chopping until no more wood
  turtle.digUp()
  turtle.up()
end

-- move back down to ground
while not turtle.detectDown() do
  turtle.down()
end

print('Done chopping tree.')