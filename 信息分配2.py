import random
group = [{},{},{},{},{},{},{},{},{},{}]
name = ['高一','黄二','张三','李四','王五','李六','孙七','钱八','赵九','刘十']
for i in range(len(group)):
    group[i]['姓名：'] = name[i]
    group[i]['年龄：'] = random.randint(18,24)
    group[i]['电话：'] = '135' + str(random.randint(0,99999999)).rjust(8,'0')
for index in range(len(group)):
    print('\n第%d名组员信息：' % (index+1))
    for key,value in group[index].items():
        print(key,value,' ',end='')