#输出hello
print('hello')
#单引号把双引号包在里面，双引号转义，输出"hello"
print('"hello"')
#双引号把单引号包在里面，单引号转义，输出guido's
print("guido's")
#第一个斜杆对"进行转义，第二个斜杠对'进行转义。第三个斜杠对"进行转义，输出"hello guido's python"
print("\"hello guido\'s python\"")
#\t 表示横向制表符 %s 进行字符串格式化输出，输出hello world
print("%s\t%s" % ("hello", "world"))