def fun(a,b,*args,**kwargs):

    print("a =%d" % a)
    print("b =%d" % b)
    print("args:")
    print(args)
    print("kwargs: ")
    for i,value in kwargs.items():
        print("key=%s" % value)

fun(1,2,3,4,5,m=6,n=7,p=8)