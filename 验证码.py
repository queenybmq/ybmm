import random
A = ('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')
while True:
    num = random.sample(A, 4)
    num = (num[0] + num[1] + num[2] + num[3])
    letters = num.lower()
    input_num = input("验证码为%s\n请输入验证码：" % num)
    input_num = input_num.lower()
    if input_num == letters:
        print("正确，成功进入")
        break
    else:
        pass