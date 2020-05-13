year = input("请输入年份：")
while str.isdigit(year) == False:
    year = input("请输入年份：")
year = int(year)
if year % 4 == 0 and year % 100 !=0:
    print("闰年")
elif year % 400 == 0:
    print("闰年")
else:
    print("平年")
