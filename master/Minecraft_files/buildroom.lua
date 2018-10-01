--[[Room Building program by Al Sweigart
Builds a room of four walls.]]

os.loadAPI('hare')

-- handle command line arguments
local cliArgs = {...}
local length = tonumber(cliArgs[1])
local width = tonumber(cliArgs[2])
local height = tonumber(cliArgs[3])

if length == nil or width == nil or height == nil or cliArgs[1] == '?' then
  print('Usage: buildroom <length> <width> <height>')
  return
end

print('Building...')
if hare.buildRoom(length, width, height) == false then
  error('Not enough blocks.')
end
print('Done.')