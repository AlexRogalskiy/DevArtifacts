import random

NUM_DIGITS = 3
MAX_GUESS = 10

def getSecretNum():
    # Возвращает строку уникальных случайных цифр, длина которой составляет NUM_DIGITS.
    numbers = list(range(10))
    random.shuffle(numbers)
    secretNum = ''
    for i in range(NUM_DIGITS):
        secretNum += str(numbers[i])
    return secretNum

def getClues(guess, secretNum):
    # Возвращает строку с подсказками пользователю "Тепло", "Горячо" и "Холодно".
    if guess == secretNum:
        return 'Вы угадали!'

    clues = []
    for i in range(len(guess)):
        if guess[i] == secretNum[i]:
            clues.append('Горячо')
        elif guess[i] in secretNum:
            clues.append('Тепло')
    if len(clues) == 0:
        return 'Холодно'

    clues.sort()
    return ' '.join(clues)

def isOnlyDigits(num):
    # Возвращает значение True, если num - строка, состоящая только из цифр. В противном случае возвращает False.
    if num == '':
        return False

    for i in num:
        if i not in '0 1 2 3 4 5 6 7 8 9'.split():
            return False

    return True


print('Я загадаю %s-х значное число, которое вы должны отгадать.' % (NUM_DIGITS))
print('Я дам несколько подсказок...')
print('Когда я говорю:    Это означает:')
print('  Холодно          Ни одна цифра не отгадана.')
print('  Тепло            Одна цифра отгадана, но не отгадана ее позиция.')
print('  Горячо           Одна цифра и ее позиция отгаданы.')

while True:
    secretNum = getSecretNum()
    print('Итак, я загадал число. У вас есть %s попыток, чтобы отгадать его.' % (MAX_GUESS))

    guessesTaken = 1
    while guessesTaken <= MAX_GUESS:
        guess = ''
        while len(guess) != NUM_DIGITS or not isOnlyDigits(guess):
            print('Попытка №%s: ' % (guessesTaken))
            guess = input()

        print(getClues(guess, secretNum))
        guessesTaken += 1

        if guess == secretNum:
            break
        if guessesTaken > MAX_GUESS:
            print('Попыток больше не осталось. Я загадал число %s.' % (secretNum))

    print('Хотите сыграть еще раз? (да или нет)')
    if not input().lower().startswith('д'):
        break
