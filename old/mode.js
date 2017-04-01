function (c, a)
{
    var i, out

    function unload() {
        out = #s.sys.upgrades()
        for (i=0; i < out.length; i++) {
            #s.sys.upgrades({unload:i})
        }
    }

    function load_locks() {
        // Load the locks.
        for (i = 0; i < 6; i++) {
            #s.sys.upgrades({load:i})
        }
    }

    function load_all() {
        // Load the first 15 upgrades.
        for (i = 0; i < 15; i++) {
            #s.sys.upgrades({load:i})
        }
    }

    if (a == null) {
        unload()
        load_all()
    } else if (a.m == "lock") {
        unload()
        load_locks()
    }
}
