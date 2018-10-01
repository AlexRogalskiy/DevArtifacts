--[[Checkerboard-Building program by Al Sweigart
Builds a checkerboard floor.]]

os.loadAPI('hare')

-- handle command line arguments
local cliArgs = {...}
local length = tonumber(cliArgs[1])
local width = tonumber(cliArgs[2])

if length == nil or width == nil or cliArgs[1] == '?' then
  print('Usage: buildcheckerboard <length> <width>')
  return
end

local placeBlack = true

function placeCheckerboard()
  -- select coal or quartz, based on placeBlack
  if placeBlack then
    hare.selectItem('minecraft:coal_block')
  else
    hare.selectItem('minecraft:quartz_block')
  end

  turtle.placeDown()
  placeBlack = not placeBlack
end

turtle.up()
hare.sweepField(length, width, placeCheckerboard)
