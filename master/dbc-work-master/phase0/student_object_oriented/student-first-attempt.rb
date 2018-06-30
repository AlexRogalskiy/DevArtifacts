class Student
  attr_accessor :scores, :ssn, :first_name
 
  def initialize(fname, ssn, scores)
    @first_name = fname
    @ssn = ssn
    @scores = scores
  end
  
  def average
    @scores.reduce(:+) / @scores.length
  end
  
  def letter_grade
    case self.average
      when 90..100 then "A"
      when 80..89 then "B"
      when 70..79 then "C"
      when 60..69 then "D"
    else "F"
    end
  end

end


class Classroom < Array #class Classroom extends class Array
    def sort #override Array.sort method to sort based on a classroom object's ssn 
        self.sort_by! {|student| student.ssn}
    end
end

#linear search: starting at the beginning, iterate over each in a (sort-unspecific) collection 
#               until find target, else reach the end and return nil
def linear_search(students, fname)
    students.find_index {|student| student.first_name == fname} || -1
end

#binary search, starting at the middle of a sorted collection. 
#               return object if its the target
#               if not
#               test if target is higher or lower; 
#                 if higher, 
#                   ditch the first half (so range is now middle+1 through the end) 
#                 if lower, 
#                   ditch the second half (so range is now array start through middle-1)
#                ...and do the same thing: pick the middle, return obj if its a winner, 
#                                          else test if higher or lower, yada yada; 
#                                          until found, else nil
def binary_search(students, ssn)
   students.sort #must sort for binary search
   students.index(students.bsearch {|student| ssn <=> student.ssn}) || -1
end

alex = Student.new('Alex', '111-11-1111', [100, 100, 100, 0, 100])
tam = Student.new('Tam', '733-44-7503', [99, 95, 88, 93, 99])
caroline = Student.new('Caroline', '314-21-2345', [98, 100, 97, 88, 99])
paige = Student.new('Paige', '343-00-9837', [90, 83, 98, 79, 95])
justin = Student.new('Justin', '724-44-7359', [95, 85, 75, 65, 55])
 

 #students is object of class Classroom-which extends Array 
 # and thus inherits its methods/behavior-so we can override the Array.sort behavior 
 # and still (basically?) be creating a working array object, students, for Objective 1.
students = Classroom.new([alex, tam, caroline, paige, justin]) 


#===========DRIVER CODE : DO NOT MODIFY =======
 
#Make sure these tests pass

# Tests for part 1:
p students[0].first_name == "Alex"
p students[0].scores.length == 5
p students[0].scores[0] == students[0].scores[4]
p students[0].scores[3] == 0
 
# Tests for part 2
p students[0].average == 80
p students[0].letter_grade == 'B'
 
# Tests for part 3
p linear_search(students, "Alex") == 0
p linear_search(students, "Tam") == 1
p linear_search(students, "Caroline") == 2
p linear_search(students, "Paige") == 3
p linear_search(students, "Justin") == 4
p linear_search(students, "NOT A STUDENT") == -1




# Tests for bonus part 1
students.sort
p students[0].ssn < students[1].ssn
p students[3].ssn > students[0].ssn

# Tests for bonus part 2

p binary_search(students, "111-11-1111") == 0
p binary_search(students, "733-44-7503") == 4
p binary_search(students, "314-21-2345") == 1
p binary_search(students, "343-00-9837") == 2
p binary_search(students, "724-44-7359") == 3
p binary_search(students, "000-00-0000") == -1


# EDIT: I ended up redoing this problem adn doing away with inheritance by including module Comparable in Student class
# https://gist.github.com/carolineartz/fcfb13655f15e896ffdd#file-student-rb


# NOTE: Reflection based on my original inheritance code. See new submission, link above for new code.
# Re: BONUS: I hope this is on the right track... Pagie and I had some laughs and some cries 
# before applying inheritance...seemed like some of the driver code wasn't robust enough to account 
# for coincidences with this small of a data set. so maybe a lesson to always consider all possible 
# evils. the object concept of a classroom extending array seems off but either way, 
# it was good to get back into OOP stuff, look at search agorithms...and gain a little more experience
# with recursive concepts/applications. 

