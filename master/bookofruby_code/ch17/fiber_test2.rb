# The Book of Ruby - http://www.sapphiresteel.com

fiber = Fiber.new do |first|
    second = Fiber.yield first + 2
end

puts fiber.resume 10
puts fiber.resume 14
puts fiber.resume 18
