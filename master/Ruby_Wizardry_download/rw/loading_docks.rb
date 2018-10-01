def create_loading_docks(docks=3)
  loading_docks = []

  (1..docks).each do |number|
    file_name = "dock_#{number}.txt"
    loading_docks << file_name
    file = File.open(file_name, 'w+')
    file.write("Loading dock no. #{number}, reporting for duty!")
    file.close
  end

  loading_docks
end

def open_loading_docks(docks)
  docks.each do |dock|
    file = File.open(dock, 'r')
    puts file.read
    file.close
  end
end

all_docks = create_loading_docks(5)
open_loading_docks(all_docks)
