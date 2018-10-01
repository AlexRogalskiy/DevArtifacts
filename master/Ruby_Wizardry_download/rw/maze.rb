puts "Holy giraffes! You fell into a maze!"
print "Where to? (N, E, S, W): "
direction = gets.chomp

puts "#{direction}, you say? A fine choice!"

if direction == "N"
  puts "You are in a maze of twisty little passages, all alike."
elsif direction == "E"
  puts "An elf! And his pet ham!"
elsif direction == "S"
  puts "A minotaur! Wait, no, that's just your reflection."
elsif direction == "W"
  puts "You're here, wherever here is."
else
  puts "Wait, is that even a direction?"
end
