results=int(input("请输入你的成绩："))
while results < 0 or results > 100:
    print("请重新输入成绩：")
    results=int(input("请输入你的成绩："))
if 0 <= results < 60:
    print("不及格")
if 60 <= results < 80:
    print("及格")
if 80 <= results < 90:
    print("良好")
if 90 <= results <=100:
    print("优秀")
