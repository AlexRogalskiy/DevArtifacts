# The Book of Ruby - http://www.sapphiresteel.com

arr1=['h','e','l','l','o',' ','w','o','r','l','d']
arr2=arr1
arr3=arr1.clone

arr1.reverse!
p(arr1)
p(arr2) # note arr2 is reversed
p(arr3) # but the cloned arr3 is not!