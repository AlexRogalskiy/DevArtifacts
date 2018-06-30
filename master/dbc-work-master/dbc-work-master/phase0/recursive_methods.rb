#Output: number of  possible teams

def choose_team(n, k)
  return n if k == 1
  return 0 if k == 0 || n == 0
  choose_team(n-1,k-1) + choose_team(n-1,k)
end


p choose_team(6,1) == 6
p choose_team(6,2) == 15
p choose_team(6,3) == 20
p choose_team(24,4) == 10626

