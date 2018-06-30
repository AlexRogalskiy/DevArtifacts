# PROBLEM SPACE: CREATING A COCKTAIL
# DESIGN PATTERN: COMPOSITE

# I did this as an exercise in trying to apply a composite design pattern to a real world scenario. 

class CocktailRoutine
  attr_accessor :name, :alcohol_content, :calories

  def initialize(name)
    @name = name
    @alcohol_content = 0
    @calories = 0
  end

end

class AddIngredient < CocktailRoutine
  def initialize(ingredient)
    super(ingredient)
    display_action
  end

  def display_action
    puts 'Add ' + self.name
  end

end


class AddAlcohol < AddIngredient
  def initialize(alcohol, alcohol_content, calories)
    super(alcohol)
    @alcohol_content = alcohol_content
    @calories = calories
  end
end


class AddMixer < AddIngredient
  def initialize(mixer, calories)
    super(mixer)
    @calories = calories
  end
end


class AddGarnish < AddIngredient
  def initialize(garnish)
    super(garnish)
  end
end

class AddIce < AddIngredient
  def initialize
    super('ice')
  end
end



#Composite
class MixCocktail < CocktailRoutine

  def initialize(name)
    super(name)
    @ingredients = []
  end

  #add ability to push ingredients via << syntax
  def <<(ingredient)
    @ingredients << ingredient
  end

  #add ability to access ingredient items at their index...
  def [](index)
    @ingredients[index]
  end

  def get_drink_alcohol
    total_alcohol = 0
    @ingredients.each {|ingredient| total_alcohol += ingredient.alcohol_content}
    "drink total alcohol: #{total_alcohol}"
  end

  def get_drink_calories
    total_calories = 0
    @ingredients.each {|ingredient| total_calories += ingredient.calories}
    "drink total calories: #{total_calories}"
  end

end


class MakeDrink < MixCocktail
  def initialize(alcohols, mixers, garnishes)

    super('Make Drink')

    @ingredients << AddIce.new
    alcohols.each            {|ingredient| @ingredients << ingredient}
    mixers.each              {|mixer|      @ingredients << mixer     }
    garnishes.each           {|garnish|    @ingredients << garnish   }

  end
end



jameson_ginger = MakeDrink.new( [AddAlcohol.new('Jameson', 2, 140) ],
                                [AddMixer.new('diet ginger ale', 0)],
                                [AddGarnish.new('lime wedge')      ]  )



puts jameson_ginger.get_drink_alcohol
puts jameson_ginger.get_drink_calories




# I did a lot of reading on design patterns...well it seemed like i did, but there is so much, i don't feel like I even
# scratched the surface... I tried to work on a composite relationship here...I am working on refactoring/restructuring
# this so that my ingredient objects can be instantiated by one of the methods and not part of the main method  and as a
# result, print out in the right order, which they don't do now. I think I almost have it but I didn't quite have things
# figured out so I wanted to submit this  first attempt. Although I did this more as a conceptual exercise and not
# really feeling like this was "good" code...the composite pattern seems like it creates sooooo many classes. Maybe this
# just wasn't a good real world situation to model with a composite hierarchical pattern. Hopefully I will  get better
# at identifying relationships and how they appropriately map to object oriented design patterns very soon!

