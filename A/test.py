from pyswip import Prolog

p = Prolog()
p.assertz("father(john,ben)")
p.assertz("father(john,marry)")
a = p.query("father(john,X)")
print(list(a))