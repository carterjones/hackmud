# t1 targets

- accenture
- amal_robo
- bluebun
- halperyon
- nuutec
- protein_prevention
- ros13
- suborbital_airlines

# t2 targets

- bunnybat_hut
- setec_gas
- suborbital_airlines
- weyland

# strange targets

- `blackstar` generates scripts that don't exist

# shortcuts

    /u = sys.upgrades
    /fs = scripts.fullsec
    /hl = kernel.hardline
    /dc = kernel.hardline {dc:true}
    /lock = mode{m:"lock"}
    /dev = mode{m:"dev"}
    /us = scripts.user

# safe targets

- nuutec
- suborbital_airlines
- weyland

# db notes

From [here](https://www.hackmud.com/forums/new_players/how_to_script_please_):

- count: #db.c()
- insert: #db.i()
- update: #db.u()
- remove: #db.r()
- find: #db.f()
- findAndModify: #db.m()
- save: #db.s()

## example db usage

    function(c,a) {
        // Remove any old test documents.
        #db.r({ script:"test" })
        // Insert a new test document.
        #db.i({ script:"test", value:"myvalue" })
        // Save an update to the existing test document.
        #db.s({ script:"test", value:"mynewvalue" })
        // Return the test document.
        return #db.f({ script:"test" }).first()
    }

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

# various commands

    sys.migrate      // bypass the tutorial
    sys.status       // get system status
    accts.xfer_gc_to // transfer money to another account

# how to t2

1. Find a FULLSEC entry, look at the pages, get usernames.
1. Find a HIGHSEC/MIDSEC entry for the same user.
1. Execute the following command and find a username where this works: `user.script {username:"theuser", action:"order_qrs"}`
1. Parse the QR codes and find the ID.

# useful links

- [How to find t2 NPCs](http://steamcommunity.com/sharedfiles/filedetails/?id=771040875)
- [Decoding small QR codes by hand](http://blog.qartis.com/decoding-small-qr-codes-by-hand/)
- [How to Read QR Symbols Without Your Mobile Telephone](http://www.ams.org/samplings/feature-column/fc-2013-02)
