import pygame,sys,random
from pygame.locals import *
redColor = pygame.Color(255,0,0)
blackColor = pygame.Color(0,0,0)
whiteColor = pygame.Color(255,255,255)
def gameover():
    pygame.quit()
    sys.exit()
def main():
    pygame.init()
    fpsClock = pygame.time.Clock()
    playsurface = pygame.display.set_mode((640,480))
    pygame.display.set_caption("贪吃蛇")
    snakePosition = [100,100]
    snakeBody = [[100,100],[80,100],[60,100]]
    targetPosition = [300,300]
    targetflag = 1
    direction = "right"
    changeDirection = direction
    while True:
        for event in pygame.event.get():
            if event.type == QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == KEYDOWN:
                if event.key == K_d:
                    changeDirection = "right"
                if event.key == K_a:
                    changeDirection = "left"
                if event.key == K_w:
                    changeDirection = "up"
                if event.key == K_s:
                    changeDirection = "down"
                if event.key == K_ESCAPE:
                    pygame.event.post(pygame.event.Event(QUIT))
        if changeDirection == "left" and not direction == "right":
            direction = changeDirection
        if changeDirection == "right" and not direction == "left":
            direction = changeDirection
        if changeDirection == "up" and not direction == "down":
            direction = changeDirection
        if changeDirection == "down" and not direction == "up":
            direction = changeDirection
        if direction == "right":
            snakePosition[0] +=20
        if direction == "left":
            snakePosition[0] -=20
        if direction == "up":
            snakePosition[1] -=20
        if direction == "down":
            snakePosition[1] +=20
        snakeBody.insert(0,list(snakePosition))
        if snakePosition[0] == targetPosition[0] and snakePosition[1] == targetPosition[1]:
            targetflag = 0
        else:
            snakeBody.pop()
        if targetflag == 0:
            x = random.randrange(1,32)
            y = random.randrange(1,24)
            targetPosition = [int(x*20),int(y*20)]
            targetflag = 1
        playsurface.fill(blackColor)
        for position in snakeBody:
            pygame.draw.rect(playsurface,redColor,Rect(position[0],position[1],20,20))
            pygame.draw.rect(playsyrface,whiteColor,Rect(targetPosition[0],targetPosition[1],20,20))
        pygame.display.flip()
        if snakePosition[0] > 620 or snakePosition[0] < 0:
            gameover()
        elif snakePosition[1] > 462 or snakePosition[1] < 0:
            gameover()
        fpsClock.tick(2)
if _name_ == "_main_":
    main()
