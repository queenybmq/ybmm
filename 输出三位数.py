num = input("请输入一个三位数的自然数:")
while len(num) != 3:
    num = input("请重新输入")
for i in num:
    b = (num//100)
    c = (num%100//10)
    d = (num%10)
    print("百位数：",b,"十位数：",c,"个位数：",d)
