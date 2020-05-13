my_list = ['kevin','sam','lucy','lili']
print(len(my_list))
my_list.append('jim')
print(my_list)
my_list.insert(0,'tony')
print(my_list)
my_list[1] = 'poli'
print(my_list)
my_list.remove('tony')
print(my_list)
print(my_list[1])
del my_list[1]
print(my_list)
my_list_copy = my_list[:]
print(my_list_copy)
del my_list[1:4]
print(my_list)
for x in range(len(my_list_copy)):
    print(x)
for i in my_list_copy:
    print(i)

