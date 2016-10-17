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
        for (i=3; i < 6; i++) {
            #s.sys.upgrades({load:i})
        }
    }

    function load_dev_upgrades() {
        #s.sys.upgrades({load:6})  // script_slot_v1
        #s.sys.upgrades({load:11}) // char_count_v1
        #s.sys.upgrades({load:12}) // char_count_v1
    }

    if (a.m == "lock") {
        unload()
        load_locks()
    } else if (a.m == "dev") {
        unload()
        load_locks()
        load_dev_upgrades()
    }
}
