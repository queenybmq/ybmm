a = input("请输入一个三位数的自然数:")
num = int(a)
while num < 100 or num > 999:
    print("请重新输入")
    a = input("请输入一个三位数的自然数:")
    num = int(a)
b = (num//100)
c = (num%100//10)
d = (num%10)
print("百位数：",b,"十位数：",c,"个位数：",d) 
