-- Bonus Activity: Lone Turtle Farmer

-- In farmtrees program, comment
-- out while loop on line 14 and
-- end statement on line 57.

local NUM_TREE_PLOTS = 3

while true do
  for i = 1, NUM_TREE_PLOTS do
    -- Run farmtrees
    shell.run('farmtrees')

    -- Move to next tree plot.
    if i ~= NUM_TREE_PLOTS then
      turtle.turnRight()
      for i = 1, 6 do
        turtle.forward()
      end
      turtle.turnLeft()
    end
  end

  -- Move back to first tree plot.
  turtle.turnLeft()
  for j = 1, 6 * (NUM_TREE_PLOTS - 1) do
    turtle.forward()
  end
  turtle.turnRight()
end