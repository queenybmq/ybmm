x = int(input("请输入一个三位数："))
while x > 999 or x < 99:
    print("请重新输入：")
    x = int(input("请输入一个三位数："))
a = (x // 100)
b = (x % 100 // 10)
c = (x % 10)
print(a,b,c)
