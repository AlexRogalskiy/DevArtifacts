let fibonacci n =
  let rec f = function
              | 1 -> 1
              | n -> g (n - 1)
  and g = function
          | 1 -> 0
          | n -> g (n - 1) + f (n - 1)
  f n + g n

fibonacci 6
