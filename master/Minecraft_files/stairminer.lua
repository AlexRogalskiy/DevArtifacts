--[[ Stair Miner program by Al Sweigart
Mines in a stair pattern. ]]

os.loadAPI('hare')

local cliArgs, targetDepth, columnDepth, result, errorMessage

cliArgs = {...}
targetDepth = tonumber(cliArgs[1])

-- display "usage" info
if targetDepth == nil or cliArgs[1] == '?' then
  print('Usage: stairminer <depth>')
  return
end

turtle.digDown()

columnDepth = 2
while true do
  -- move forward
  hare.digUntilClear()
  turtle.forward()

  -- mine while descending
  for i = 1, columnDepth do
    -- check for bedrock
    result, errorMessage = turtle.digDown()
    if errorMessage == 'Unbreakable block detected' then
      print('Hit bedrock. Done.')
      return
    else
      turtle.down()
    end
  end

  -- check if done
  print('Current depth: ' .. columnDepth)
  if columnDepth >= targetDepth then
    print('Done.')
    return
  end

  -- move forward
  hare.digUntilClear()
  turtle.forward()
  turtle.digDown()

  -- check if there's enough fuel to go up and back down again
  while turtle.getFuelLevel() < (columnDepth * 2) do
    -- try to burn fuel items in the inventory
    for slot = 1, 16 do
      turtle.select(slot)
      turtle.refuel()
    end

    if turtle.getFuelLevel() < (columnDepth * 2) then
      print('Please load more fuel...')
      os.sleep(10)
    end
  end

  -- check for a full inventory
  while hare.selectEmptySlot() == false do
    print('Please unload the inventory...')
    os.sleep(10)
  end

  -- mine while ascending
  for i = 1, columnDepth do
    hare.digUpUntilClear()
    turtle.up()
  end

  columnDepth = columnDepth + 2
end
