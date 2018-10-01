# Sets the priority of thr to integer. 
# Higher-priority threads will run before lower-priority threads.

   count1 = count2 = 0
   a = Thread.new do
         loop { count1 += 1 }
       end
   a.priority = -1

   b = Thread.new do
         loop { count2 += 1 }
       end
   b.priority = -2
   p sleep 1   #=> 1
   p count1    #=> 622504
   p count2    #=> 5832

