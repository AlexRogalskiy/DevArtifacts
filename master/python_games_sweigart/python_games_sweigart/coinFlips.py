import random
print('Я подброшу монетку 1000 раз. Угадай, сколько раз выпадет "Орел"? (Нажми клавишу Enter, чтобы начать)')
input()
flips = 0
heads = 0
while flips < 1000:
    if random.randint(0, 1) == 1:
        heads = heads + 1
    flips = flips + 1

    if flips == 900:
        print('900 подкидываний и "Орел" выпал ' + str(heads) + ' раз.')
    if flips == 100:
        print('При 100 бросках, "Орел" выпал ' + str(heads) + ' раз.')
    if flips == 500:
        print('Полпути пройдено и "Орел" выпал  ' + str(heads) + ' раз.')

print()
print('Из 1000 подбрасываний монетки "Орел" выпал ' + str(heads) + ' раз!')
print('Насколько вы близки к правильному ответу?')