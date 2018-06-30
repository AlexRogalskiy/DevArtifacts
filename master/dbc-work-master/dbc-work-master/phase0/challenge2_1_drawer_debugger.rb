class Drawer
  #don't need attribute reader for content at this point

  def initialize
    @contents = []
    @open = true
  end

  def open
    @open = true
  end

  def close
    @open = false
  end

  def add_item(item)
    raise ArgumentError.new('Whoops! Open the drawer first!') unless @open
    @contents << item
  end

  def remove_item(item = @contents.last) #default won't pop last item off until passes test for contains item
    raise ArgumentError.new('Hmmm..don\'t see one of those...') unless @contents.include?(item)
    @contents.delete(item)
  end

  def dump # clears drawer and calls #view_contents which puts message about drawer being empty
    @contents.clear
    view_contents
  end

  def view_contents
    if @contents.empty?
      puts 'Your drawer is empty.'
    else
      puts 'The drawer contains:'
      @contents.each { |silverware| puts '- ' + silverware.type }
    end
  end

end


class Silverware
  attr_reader :type

  def initialize(type, clean = true)
    @type = type
    @clean = clean
  end

  def clean
    @clean = true
  end

  def eat
    puts "eating with the #{@type}"
    @clean = false
  end

  def is_clean?
    puts "This #{@type} is all clean!" if @clean
    puts "This #{@type} is dirty!" unless @clean
  end

end


silverware_drawer = Drawer.new

knife1 = Silverware.new('knife')
silverware_drawer.add_item(knife1)

silverware_drawer.add_item(Silverware.new('spoon'))
silverware_drawer.add_item(Silverware.new('fork'))

silverware_drawer.view_contents ##should have knife, spoon, fork

silverware_drawer.remove_item
silverware_drawer.view_contents ##removed default last item (fork), should have knife, spoon

sharp_knife = Silverware.new('sharp_knife')
silverware_drawer.add_item(sharp_knife)
silverware_drawer.view_contents ##added item: sharp knife. should have knife, spoon, sharp_knife

silverware_drawer.remove_item(sharp_knife)
silverware_drawer.view_contents ##gonna eat, so remove sharp_knife; should have knife and spoon

sharp_knife.eat

sharp_knife.is_clean? ##sharp knife should be dirty
sharp_knife.clean
sharp_knife.is_clean? ##cleaned sharp knife. now it should be clean

silverware_drawer.add_item(sharp_knife)
silverware_drawer.view_contents ##added back in sharp knife: should have knife, spoon, sharp_knife

silverware_drawer.dump ##emptying drawer, should be empty
silverware_drawer.view_contents ##showing contents to double check its empty

fork = Silverware.new('fork')
silverware_drawer.add_item(fork)
silverware_drawer.view_contents ##got a new fork; should have only a fork

silverware_drawer.remove_item(fork)
silverware_drawer.view_contents ##removed fork; drawer should be empty
silverware_drawer.close ##closed the drawer

fork.eat ##eat with fork
fork.is_clean? ##fork should be dirty
fork.clean 
fork.is_clean? ##cleaned my fork, should be clean

silverware_drawer.add_item(fork) #raise argument error, can't add item before opening the drawer!

silverware_drawer.open ##opened the drawer
silverware_drawer.add_item(fork)
silverware_drawer.view_contents ##added fork, should have only a fork

spork = Silverware.new('spork') #for testing argument error

silverware_drawer.remove_item(spork) #raise argument error, can't remove item not in drawer

###################################REFLECTION#######################################
# This challenge was a little difficult to get started. It was tough to really understand what it was
# modeling. It seems a little weird to have `item` and `type` as they are and not have an is-a
# relationship: item is a type (e.g, sharp knife is a knife). But I guess that isn't what's going on.
