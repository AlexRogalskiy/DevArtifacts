-- Bonus Activity: Build Crosshair Room

os.loadAPI('hare')

local cliArgs = {...}
local length = tonumber(cliArgs[1])
local height = tonumber(cliArgs[2])

if length == nil or height == nil then
  print('Usage: buildcrosshair [length] [height]')
  return
end

for i = 1, 4 do
  hare.buildWall(length - 1, height)
  turtle.turnLeft()
  hare.buildWall(length - 1, height)
  turtle.turnRight()
  hare.buildWall(length - 1, height)
  turtle.turnRight()
end