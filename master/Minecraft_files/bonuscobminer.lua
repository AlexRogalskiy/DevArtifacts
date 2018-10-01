-- Bonus Activity: Cobblestone Miner with Different Number of Furnaces

-- This program is a copy of
-- cobminer, with a different
-- value for NUM_FURNACES.

os.loadAPI('hare')  -- load the hare module
local numToDrop
local NUM_FURNACES = 6

print('Starting mining program...')
while true do
  -- mine cobblestone
  if turtle.detect() then
    print('Cobblestone detected. Mining...')
    turtle.dig()  -- mine cobblestone
  else
    print('No cobblestone. Sleeping...')
    os.sleep(0.5)  -- half second pause
  end

  -- check for a full stack of cobble
  hare.selectItem('minecraft:cobblestone')
  if turtle.getItemCount() == 64 then
    -- check turtle's fuel
    if turtle.getFuelLevel() < (2 * NUM_FURNACES) then
      error('Turtle needs more fuel!')
    end

    -- put cobble in furnaces
    print('Dropping off cobblestone...')
    for furnacesToFill = NUM_FURNACES, 1, -1 do
      turtle.back()  -- move over furnace
      numToDrop = math.floor(turtle.getItemCount() / furnacesToFill)
      turtle.dropDown(numToDrop)  -- put cobblestone in furnace
    end

    -- move back to cobblestone generator
    for moves = 1, NUM_FURNACES do
      turtle.forward()
    end

    if turtle.getItemCount() > 0 then
      print('All furnaces full. Sleeping...')
      os.sleep(300)  -- wait for 5 minutes
    end
  end
end
