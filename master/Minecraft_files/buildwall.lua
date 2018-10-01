--[[Wall-Building program by Al Sweigart
Builds a wall.]]

os.loadAPI('hare')

-- handle command line arguments
local cliArgs = {...}
local length = tonumber(cliArgs[1])
local height = tonumber(cliArgs[2])

if length == nil or height == nil or cliArgs[1] == '?' then
  print('Usage: buildwall <length> <height>')
  return
end

print('Building...')
if hare.buildWall(length, height) == false then
  error('Not enough blocks.')
end
print('Done.')