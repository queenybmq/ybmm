import random
name = ['高一','黄二','张三','李四','王五','李六','孙七','钱八','赵九','刘十']
group = [{},{},{},{},{},{},{},{},{},{}]
tag = 0
age = []
number = []
for num in range(10):
    age.append(random.randint(18,24))
    number.append('135' + str(random.randint(0,99999999)).rjust(8,'0'))
for i in range(10):
    a = random.randint(0, 9)
    while group[i].get('姓名：') != None:
        a = random.randint(0, 9)
        break
    group[i]['姓名：'] = name[a]
    while group[i].get('年龄：') != None:
        a = random.randint(0, 9)
        break
    group[i]['年龄：'] = age[a]
    while group[i].get('电话：') != None:
        a = random.randint(0, 9)
        break
    group[i]['电话：'] = number[a]
for index in range(len(group)):
    print('\n第%d名组员信息：' % (index+1))
    for key,value in group[index].items():
        print(key,value,' ',end='')



