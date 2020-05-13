import random
my_age = random.randint(0,99)
count = 0
while count < 100:
    count += 1
    tag = str(my_age)
    a = tag[-1]
    if a == "3":
        print(tag)
    else:
        pass
    my_age = random.randint(0,99)