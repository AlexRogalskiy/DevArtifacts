-- Bonus Activity: Bake a Cake

--[[
This assumes the bakery is laid out like this:

1.2.3.4.5
T........
C........

Where the letters represent:
C - An empty space where the cake will be placed.
T - Where the turtle starts, facing towards C.
1 - A chest with milk buckets.
2 - A chest with eggs.
3 - A chest with sugar.
4 - A chest with wheat.
5 -
. - Empty spaces.

]]

-- Make sure the turtle is equipped with a crating table.
if turtle.craft == nil then
  error('Turtle needs to be equipped with a crafting table!')
end

-- Make sure the turtle is facing an empty space where the cake will go.
if turtle.detect() then
  error('There is something blocking where the cake will go!')
end

-- Make sure the turtle's inventory starts out empty.
for slot = 1, 16 do
  if turtle.getItemCount(slot) > 0 then
    error('The turtle inventory must be empty!')
  end
end

-- Turn to face the milk bucket chest.
turtle.turnLeft()
turtle.turnLeft()

-- Pick up milk buckets from the milk chest.
for slot = 1, 3 do
  turtle.select(slot)
  while turtle.getItemCount() == 0 do
    -- Keeps looping until a milk bucket is put in the turtle's inventory.
    result = turtle.suck(1)
    if result == false then
      print('Waiting for more milk in chest...')
      os.sleep(10) -- wait 10 seconds for the player to put milk buckets in the milk chest
    end
  end
end

-- Go to egg chest.
turtle.turnRight()
turtle.forward()
turtle.forward()
turtle.turnLeft()

-- Pick up an egg from egg chest.
turtle.select(6)
while turtle.getItemCount() == 0 do
  -- Keeps looping until an egg is put in the turtle's inventory.
  result = turtle.suck(1)
  if result == false then
    print('Waiting for more eggs in chest...')
    os.sleep(10) -- wait 10 seconds for the player to put eggs in the egg chest
  end
end

-- Go to sugar chest.
turtle.turnRight()
turtle.forward()
turtle.forward()
turtle.turnLeft()

-- Pick up eggs from sugar chest.
for slot = 5, 7, 2 do
  turtle.select(slot)
  while turtle.getItemCount() == 0 do
    -- Keeps looping until sugar is put in the turtle's inventory.
    result = turtle.suck(1)
    if result == false then
      print('Waiting for more sugar in chest...')
      os.sleep(10) -- wait 10 seconds for the player to put sugar in the sugar chest
    end
  end
end

-- Turn to face the wheat chest.
turtle.turnRight()
turtle.forward()
turtle.forward()
turtle.turnLeft()

-- Pick up wheat from the wheat chest.
for slot = 9, 11 do
  turtle.select(slot)
  while turtle.getItemCount() == 0 do
    -- Keeps looping until a wheat is put in the turtle's inventory.
    result = turtle.suck(1)
    if result == false then
      print('Waiting for more wheat in chest...')
      os.sleep(10) -- wait 10 seconds for the player to put wheat in the wheat chest
    end
  end
end

-- Make the cake
turtle.select(16)
turtle.craft()

-- Put the empty buckets back into the empty bucket chest
turtle.turnRight()
turtle.forward()
turtle.forward()
turtle.turnLeft()
for slot = 1, 3 do
  turtle.select(slot)
  turtle.drop()
end

-- Place the cake back at the starting position.
turtle.turnLeft()
turtle.forward()
turtle.forward()
turtle.forward()
turtle.forward()
turtle.forward()
turtle.forward()
turtle.forward()
turtle.forward()
turtle.turnLeft()
turtle.select(16)
turtle.place()