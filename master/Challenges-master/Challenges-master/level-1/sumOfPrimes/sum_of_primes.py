def sum_of_primes(n):
    primes, i = [], 1
    while (len(primes) < n):
        if is_prime(i):
            primes.append(i)
        i += 1
    return sum(primes)


def is_prime(number):    
    if number == 1:
        return False
    for i in xrange(2, number):
        if number % i == 0:
            return False
    return True

if __name__ == "__main__":
    print sum_of_primes(1000)