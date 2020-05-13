tu = ('alex','eric','rain')
li = [1,2,3]
print(len(tu))
print(tu[1])
print(tu[:])
for i in tu:
    print(i)
for a in range(len(tu)):
    print(a)
tu_to_list = list(tu)
print(type(tu_to_list))
li_to_tuple = tuple(li)
print(type(li_to_tuple))

