import pygame, sys
from pygame.locals import *

# Настройка pygame.
pygame.init()

# Настройка окна.
windowSurface = pygame.display.set_mode((500, 400), 0, 32)
pygame.display.set_caption('Привет, мир!')

# Назначение цветов.
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

# Назначение шрифтов.
basicFont = pygame.font.SysFont(None, 48)

# Настройка текста.
text = basicFont.render('Привет, мир!', True, WHITE, BLUE)
textRect = text.get_rect()
textRect.centerx = windowSurface.get_rect().centerx
textRect.centery = windowSurface.get_rect().centery

# Нанесение на поверхность белого фона.
windowSurface.fill(WHITE)

# Нанесение на поверхность зеленого многоугольника.
pygame.draw.polygon(windowSurface, GREEN, ((146, 0), (291, 106), (236, 277), (56, 277), (0, 106)))

# Нанесение на поверхность синих линий.
pygame.draw.line(windowSurface, BLUE, (60, 60), (120, 60), 4)
pygame.draw.line(windowSurface, BLUE, (120, 60), (60, 120))
pygame.draw.line(windowSurface, BLUE, (60, 120), (120, 120), 4)

# Нанесение на поверхность синего круга.
pygame.draw.circle(windowSurface, BLUE, (300, 50), 20, 0)

# Нанесение на поверхность красного эллипса.
pygame.draw.ellipse(windowSurface, RED, (300, 250, 40, 80), 1)

# Нанесение на поверхность фонового прямоугольника для текста.
pygame.draw.rect(windowSurface, RED, (textRect.left - 20, textRect.top - 20, textRect.width + 40, textRect.height + 40))

# Получение массива пикселов поверхности.
pixArray = pygame.PixelArray(windowSurface)
pixArray[480][380] = BLACK
del pixArray

# Нанесение текста на поверхность.
windowSurface.blit(text, textRect)

# Отображение окна на экране.
pygame.display.update()

# Запуск игрового цикла.
while True:
    for event in pygame.event.get():
        if event.type == QUIT:
            pygame.quit()
            sys.exit()
