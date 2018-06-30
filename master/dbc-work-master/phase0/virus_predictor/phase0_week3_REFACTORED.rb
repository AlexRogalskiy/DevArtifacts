# YOUR NAMES: Caroline Artz (Went solo, didn't have an opportunity for a GPS for this)

require_relative 'state_data' #requires (links) the content of the file state_data (here its in the same directory)

class VirusPredictor
  attr_accessor :population

  def initialize(state_of_origin, state_data)
    @state = state_of_origin
    @population = state_data[:population]
    @population_density = state_data[:population_density]
  end


  #OBJECTIVE: Refactor the virus_effects method
  #calls the two methods below, providing reading access to their output from outside the VirusPredictor class
  def virus_effects
    predicted_deaths
    speed_of_spread
  end

  #OBJECTIVE: What is the purpose of "private". What happens if you move it elsewhere in the class?
  # if this was above the virus_effects method, it would make the virus_predictor method also unavailable for
  # access outside the VirusPredictor class, and thus make all but the instance vars inaccessible. Private methods
  # can help protect from unwanted behavior elicited outside the class, but care must be taken to ensure public
  # access to private method returns/output is made possible via getters.


  private
  #private method determines/outputs state death impact based on input population density
  #OBJECTIVE: Refactor the private method predicted_deaths
  def predicted_deaths
    calculate = lambda { |multiplier| (@population * multiplier).floor }
    number_of_deaths = case @population_density
                         when 0...50 then calculate.call(0.05)
                         when 50...100 then calculate.call(0.1)
                         when 100...150 then calculate.call(0.2)
                         when 150...200 then calculate.call(0.3)
                         else calculate.call(0.4)
                       end
    print "#{@state} will lose #{number_of_deaths} people in this outbreak"
  end

  #private method determines/outputs disease spread speed based on input state population density
  #OBJECTIVE: Refactor the private method speed_of_spread.
  def speed_of_spread #in months
    speed = case @population_density
              when 0...50 then 2.5
              when 50...100 then 2
              when 100...150 then 1.5
              when 150...200 then 1
              else 0.5
            end
    puts " and will spread across the state in #{speed} months.\n\n"
  end

  def self.state_report(data)
    data.each do |state, state_data|
      report = VirusPredictor.new(state, state_data)
      report.virus_effects
    end
  end


end

#=======================================================================

# OBJECTIVE: create a report for all 50 states, not just the 4 listed below.
VirusPredictor.state_report(STATE_DATA) #=> FOR ALL STATES, print: "<state> will lose <quantity> people in this outbreak and
                                            # will spread across the state in <time> months"


#OBJECTIVE: BONUS: Access the population by calling it on the instance.
p VirusPredictor.new('Michigan', STATE_DATA['Michigan']).population #=> 9883360
p VirusPredictor.new('Illinois', STATE_DATA['Illinois']).population #=> 12875255






