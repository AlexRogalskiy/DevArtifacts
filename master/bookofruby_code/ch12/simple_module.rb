# The Book of Ruby - http://www.sapphiresteel.com

module MyModule
   REWARD = 100   
   
	def prize
		return "You've won #{REWARD} credits"
	end
	
	def MyModule.lose
		return "Sorry, you didn't win"
	end
end	


puts( MyModule.lose )
# These won't work"
# puts( prize )
# puts( MyModule.prize )
