function(context, args) { // count:5

    INCLUDE(npc_static);
    INCLUDE(fmt_script);
    INCLUDE(stdlib)
    INCLUDE(dtr);
    INCLUDE(sort);

    var lookup = npc_static.reduce(function(hash, element) {
        hash[element] = true;
        return hash;
    }, {});

    var result = [];

    function add_scripts(list, level) {
        stdlib.each(list, function(_, script) {
            var user = stdlib.get_user_from_script(script);
            if (lookup[user]) {
                result.push({ name: script, valid: true, access: "PUBLIC", level: level });
            }
        });
    }

    add_scripts(#s.scripts.fullsec(), 4);
    add_scripts(#s.scripts.highsec(), 3);
    add_scripts(#s.scripts.midsec(), 2);
    add_scripts(#s.scripts.lowsec(), 1);
    add_scripts(#s.scripts.nullsec(), 0);

    if (context.is_scriptor || context.calling_script) {
        return result;
    }

    result = sort(result, ["name"]);

    var titles = [
        { name: "+script+", key: "script", func: fmt_script }
    ];

    result = result.map(function(element) { return [element]; });

    return {
        ok: true,
        msg: dtr.columns(result, titles, { pre: "", suf: "" }, true)
    };

}
