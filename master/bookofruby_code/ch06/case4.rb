# The Book of Ruby - http://www.sapphiresteel.com

salary = 2000000
season = 'summer'

happy = case
	when salary > 10000 && season == 'summer' then
		puts( "Yes, I really am happy!" )
		'Very happy'
	when salary > 500000 && season == 'spring' then 'Pretty happy'
	else puts( 'miserable' )
end
	
	
puts( happy )