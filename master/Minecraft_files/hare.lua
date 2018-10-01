--[[Function Module program by Al Sweigart
Provides useful utility functions.]]

-- selectItem() selects the inventory
-- slot with the named item, returns
-- true if found and false if not
function selectItem(name)
  -- check all inventory slots
  local item
  for slot = 1, 16 do
    item = turtle.getItemDetail(slot)
    if item ~= nil and item['name'] == name then
      turtle.select(slot)
      return true
    end
  end

  return false  -- couldn't find item
end


-- selectEmptySlot() selects inventory
-- slot that is empty, returns true if
-- found, false if no empty spaces
function selectEmptySlot()

  -- loop through all slots
  for slot = 1, 16 do
    if turtle.getItemCount(slot) == 0 then
      turtle.select(slot)
      return true
    end
  end
  return false -- couldn't find empty space
end


-- countInventory() returns the total
-- number of items in the inventory
function countInventory()
  local total = 0

  for slot = 1, 16 do
    total = total + turtle.getItemCount(slot)
  end
  return total
end


-- selectAndPlaceDown() selects a nonempty slot
-- and places a block from it under the turtle
function selectAndPlaceDown()

  for slot = 1, 16 do
    if turtle.getItemCount(slot) > 0 then
      turtle.select(slot)
      turtle.placeDown()
      return
    end
  end
end


-- buildWall() creates a wall stretching
-- in front of the turtle
function buildWall(length, height)
  if hare.countInventory() < length * height then
    return false  -- not enough blocks
  end

  turtle.up()

  local movingForward = true

  for currentHeight = 1, height do
    for currentLength = 1, length do
      selectAndPlaceDown() -- place the block
      if movingForward and currentLength ~= length then
        turtle.forward()
      elseif not movingForward and currentLength ~= length then
        turtle.back()
      end
    end
    if currentHeight ~= height then
      turtle.up()
    end
    movingForward = not movingForward
  end

  -- done building wall; move to end position
  if movingForward then
    -- turtle is near the start position
    for currentLength = 1, length do
      turtle.forward()
    end
  else
    -- turtle is near the end position
    turtle.forward()
  end

  -- move down to the ground
  for currentHeight = 1, height do
    turtle.down()
  end

  return true
end


-- buildRoom() constructs four walls
-- and a ceiling
function buildRoom(length, width, height)
  if hare.countInventory() < (((length - 1) * height * 2) + ((width - 1) * height * 2)) then
    return false  -- not enough blocks
  end

  -- build the four walls
  buildWall(length - 1, height)
  turtle.turnRight()

  buildWall(width - 1, height)
  turtle.turnRight()

  buildWall(length - 1, height)
  turtle.turnRight()

  buildWall(width - 1, height)
  turtle.turnRight()

  return true
end


-- sweepField() moves across the rows
-- and columns of an area in front and
-- to the right of the turtle, calling
-- the provided sweepFunc at each space
function sweepField(length, width, sweepFunc)
  local turnRightNext = true

  for x = 1, width do
    for y = 1, length do
      sweepFunc()

      -- don't move forward on the last row
      if y ~= length then
        turtle.forward()
      end
    end

    -- don't turn on the last column
    if x ~= width then
      -- turn to the next column
      if turnRightNext then
        turtle.turnRight()
        turtle.forward()
        turtle.turnRight()
      else
        turtle.turnLeft()
        turtle.forward()
        turtle.turnLeft()
      end

      turnRightNext = not turnRightNext
    end
  end

  -- move back to the start position
  if width % 2 == 0 then
    turtle.turnRight()
  else
    for y = 1, length - 1 do
      turtle.back()
    end
    turtle.turnLeft()
  end

  for x = 1, width - 1 do
    turtle.forward()
  end
  turtle.turnRight()

  return true
end


-- buildFloor() builds a rectangular
-- floor out of the blocks in the
-- inventory
function buildFloor(length, width)
  if countInventory() < length * width then
    return false  -- not enough blocks
  end

  turtle.up()
  sweepField(length, width, selectAndPlaceDown)
end


-- findBlock() spins around searching
-- for the named block next to the turtle
function findBlock(name)
  local result, block

  for i = 1, 4 do
    result, block = turtle.inspect()
    if block ~= nil and block['name'] == name then
      return true
    end
    turtle.turnRight()
  end
  return false
end


-- digUntilClear() keeps digging until
-- there are no more blocks (used when
-- sand or gravel can fall into the path)
function digUntilClear()
  while turtle.detect() do
    if not turtle.dig() then
      return false
    end
  end
  return true
end

-- digUpUntilClear() keeps digging up until
-- there are no more blocks (used when
-- sand or gravel can fall into the path)
function digUpUntilClear()
  while turtle.detectUp() do
    if not turtle.digUp() then
      return false
    end
  end
  return true
end
