-- Bonus Activity: Mylabel Program

local cliArgs = {...}
local cmd = cliArgs[1]
local name = cliArgs[2]

if cmd == nil then
  print('Usage: mylabel set [name]')
  print('       mylabel get')
  print('       mylabel clear')
  return
end

if cmd == 'set' then
  os.setComputerLabel(name)
  print('Computer label set to ' .. name)
end

if cmd == 'get' then
  if os.getComputerLabel() == nil then
    print('No computer label')
  else
    print('Computer label is ' .. os.getComputerLabel())
  end
end

if cmd == 'clear' then
  os.setComputerLabel(nil)
  print('Computer label cleared')
end

