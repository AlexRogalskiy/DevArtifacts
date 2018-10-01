function candiesToGive(name)
  if name == 'Al' then
    return 10
  end

  return 2
end

lavCandy = candiesToGive('Lavinia')
alCandy = candiesToGive('Al')
print('Lavinia gets ' .. lavCandy .. ' pieces')
print('Al gets ' .. alCandy .. ' pieces')