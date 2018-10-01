--[[Tree Farming program by Al Sweigart
Plants tree then cuts it down.]]

os.loadAPI('hare')  -- load the hare module

local blockExists, item
local logCount = 0

-- check if choptree program exists
if not fs.exists('choptree') then
  error('You must install choptree program first.')
end

while true do
  -- check inventory for saplings
  if not hare.selectItem('minecraft:sapling') then
    error('Out of saplings.')
  end

  print('Planting...')
  turtle.place() -- plant sapling

  -- loop until a tree has grown
  while true do
    blockExists, item = turtle.inspect()
    if blockExists and item['name'] == 'minecraft:sapling' then
      -- "dye" is the name ID for bone meal
      if not hare.selectItem('minecraft:dye') then
        error('Out of bone meal.')
      end

      print('Using bone meal...')
      turtle.place() -- use bone meal
    else
      break -- tree has grown
    end
  end

  hare.selectEmptySlot()
  shell.run('choptree') -- run choptree

  -- move to and face chest
  turtle.back()
  turtle.turnLeft()
  turtle.turnLeft()

  -- put logs into chest
  while hare.selectItem('minecraft:log') do
    logCount = logCount + turtle.getItemCount()
    print('Total logs: ' .. logCount)
    turtle.drop()
  end

  -- face planting spot
  turtle.turnLeft()
  turtle.turnLeft()
end
