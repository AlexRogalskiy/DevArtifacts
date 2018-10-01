function hello()
  print('Hello there!')
end

function goodbye()
  print('Goodbye!')
end

function announce(func)
  print('About to call the function.')
  func()
  print('Function called.')
end

announce(hello)  -- no parentheses after hello
announce(goodbye) -- no parentheses after goodbye