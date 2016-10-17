# shortcuts

    /u = sys.upgrades
    /fs = scripts.fullsec
    /t1 = harvest{t:#s.ros13.entry}
    /t2 = harvest{t:#s.ros13.pub}
    /t3 = harvest{t:#s.ros13.pubinfo}
    /t4 = harvest{t:#s.suborbital_airlines.pub}
    /t5 = harvest{t:#s.nuutec.entry}
    /t6 = harvest{t:#s.halperyon.pubinfo}
    /t7 = harvest{t:#s.halperyon.pub_info}
    /kh = kernel.hardline
    /dc = kernel.hardline {dc:true}
    /lock = mode{m:"lock"}
    /dev = mode{m:"dev"}
    /us = scripts.user

# safe targets

- nuutec
- suborbital_airlines

# notes

From [here](https://www.hackmud.com/forums/new_players/how_to_script_please_):

- count: #db.c()
- insert: #db.i()
- update: #db.u()
- remove: #db.r()
- find: #db.f()
- findAndModify: #db.m()
- save: #db.s()

# items

    tier_1 lock         c001
    tier_1 lock         c002
    tier_1 lock         c003
    tier_1 lock         ez_21
    tier_1 lock         ez_35
    tier_1 lock         ez_40
    tier_1 lock         w4rn
    tier_1 script       w4rn_message
    tier_1 script       expose_access_log_v1
    tier_1 script       log_writer_v1
    tier_1 script_space script_slot_v1
    tier_1 script_space char_count_v1
    tier_1 script_space public_script_v1
