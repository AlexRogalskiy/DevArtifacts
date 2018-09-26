import sys
 
def main(n):   
    return max_prime_palindrome(n)
 
 
def max_prime_palindrome(n):
    palindromes = []
    for i in xrange(n + 1):
        if is_prime(i) and str(i) == str(i)[::-1]:
            palindromes.append(i)
    return max(palindromes)


def is_prime(number):    
    if number == 1:
        return False
    for i in xrange(2, number):
        if number % i == 0:
            return False
    return True

if __name__ == "__main__":
    print main(1000)