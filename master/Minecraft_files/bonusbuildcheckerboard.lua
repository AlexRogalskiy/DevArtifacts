-- Bonus Activity: Different Colored Checkerboards

-- This program is the same as
-- buildcheckerboard but uses
-- different blocks.

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
  -- select gold or diamond, based on placeBlack
  if placeBlack then
    hare.selectItem('minecraft:gold_block')
  else
    hare.selectItem('minecraft:diamond_block')
  end

  turtle.placeDown()
  placeBlack = not placeBlack
end

turtle.up()
hare.sweepField(length, width, placeCheckerboard)
