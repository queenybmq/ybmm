from fractions import Fraction
def fra_5():
    list = []
    for i in range(5):
        list.append(Fraction(input("请输入第%d个分数：" % (i+1))))
    tup = tuple(list)
    list.remove(max(tup))
    list.remove(min(tup))
    tup_mean = (list[0] + list[1] + list[2]) / len(list)
    print('剩余分数为：',list[0],list[1],list[2],'\n剩余分数的平均值为：',tup_mean)
fra_5()