class Student
  include Comparable #enable comparison of students on ssn
  attr_reader :first_name, :ssn, :scores

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
    when 90..100 then 'A'
    when 80..89 then 'B'
    when 70..79 then 'C'
    when 60..69 then 'D'
    else 'F'
    end
  end

  def <=>(other) #define comparison attribute
    self.ssn <=> other.ssn
  end

end

# linear search: starting at the beginning, iterate over each in a (sort-unspecific) collection
#                until find target, else reach the end and return nil

def linear_search(students, fname)
  students.find_index {|student| student.first_name == fname} || -1
end

# binary search: starting at the middle of a sorted collection.
#                 return object if its the target
#                 if not
#                 test if target is higher or lower;
#                   if higher,
#                     ditch the first half (so range is now middle+1 through the end)
#                   if lower,
#                     ditch the second half (so range is now array start through middle-1)
#                  ...and do the same thing: pick the middle, return obj if its a winner,
#                                            else test if higher or lower, yada yada;
#                                            until found, else nil (in our case its -1 but general case is nil)

def binary_search(students, ssn, low=0, high=(students.length - 1))
  students.sort!
  return -1 if high < low 
  mid = (low + high) / 2
  case
  when students[mid].ssn > ssn then binary_search(students, ssn, low, mid-1)
  when students[mid].ssn < ssn then binary_search(students, ssn, mid+1, high)
  else mid
  end
end


alex = Student.new('Alex', '111-11-1111', [100, 100, 100, 0, 100])
tam = Student.new('Tam', '733-44-7503', [99, 95, 88, 93, 99])
caroline = Student.new('Caroline', '314-21-2345', [98, 100, 97, 88, 99])
paige = Student.new('Paige', '343-00-9837', [90, 83, 98, 79, 95])
justin = Student.new('Justin', '724-44-7359', [95, 85, 75, 65, 55])

students = [alex, tam, caroline, paige, justin]


#===========DRIVER CODE : DO NOT MODIFY =======

#Make sure these tests pass

## Tests for part 1:
p students[0].first_name == 'Alex'
p students[0].scores.length == 5
p students[0].scores[0] == students[0].scores[4]
p students[0].scores[3] == 0

## Tests for part 2
p students[0].average == 80
p students[0].letter_grade == 'B'

## Tests for part 3
p linear_search(students, 'Alex') == 0
p linear_search(students, 'Tam') == 1
p linear_search(students, 'Caroline') == 2
p linear_search(students, 'Paige') == 3
p linear_search(students, 'Justin') == 4
p linear_search(students, 'NOT A STUDENT') == -1

## Tests for part 4
students.sort! # without destructive sort, can't compare sorted array with below driver code
p students[0].ssn < students[1].ssn
p students[3].ssn > students[0].ssn

## Tests for part 5
p binary_search(students, "111-11-1111") == 0
p binary_search(students, "733-44-7503") == 4
p binary_search(students, "314-21-2345") == 1
p binary_search(students, "343-00-9837") == 2
p binary_search(students, "724-44-7359") == 3
p binary_search(students, "000-00-0000") == -1
p binary_search(students, "444-44-4444") == -1
