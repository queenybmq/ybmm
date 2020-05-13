#break:退出当前循环
for i in range(3):
    print("第%d轮" % i)
    for letter in "Python":
        if letter == "t":
            break
        else:
            print(letter)
#continue:跳过本轮循环，进入 下一轮循环
for i in range(3):
    print("第%d轮" % i)
    for letter in "Python":
        if letter == "t":
            continue
        else:
            print(letter)
#pass:占位符
for letter in "Python":
    if letter == "t":
        pass
    else:
        print(letter)
#exit:退出程序
for i in range(3):
    print("第%d轮" % i)
    for letter in "Python":
        if letter == "t":
            exit()
        else:
            print(letter)
