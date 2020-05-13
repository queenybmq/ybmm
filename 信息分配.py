import random
name = ['高一','黄二','张三','李四','王五','李六','孙七','钱八','赵九','刘十']
random.shuffle(name)
info = {'name':name,'age':'','number':''}
age = []
number = []
for i in range(10):
    age.append(random.randint(18,24))
info['age'] = age
for x in range(10):
    a = str(random.randint(0,99999999)).rjust(8,'0')
    number.append('135'+a)
info['number'] = number
for y in range(10):
    print('第%d名组员信息：\n姓名：%s 年龄：%d 电话：%s' % (y+1,info['name'][y],info['age'][y],info['number'][y]))