import random

def get_number():
    die_number = random.randint(1, 10)
    return die_number

random_number = get_number()
print(random_number)
