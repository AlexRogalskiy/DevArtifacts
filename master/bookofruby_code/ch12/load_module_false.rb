# The Book of Ruby - http://www.sapphiresteel.com

load( "testmod.rb", false )

# Now this code can be executed!
 puts( "  MyModule.greet" )
 puts( MyModule.greet )
 puts("  MyModule::GOODMOOD")	
 puts(MyModule::GOODMOOD)	
 include MyModule
 puts( "  greet" )
 puts( greet )
 puts( "  sayHi" )
 puts( sayHi )
 puts( "  sayHiAgain" )
 puts( sayHiAgain )
 sing