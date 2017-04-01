function(context, args) {
    INCLUDE(stdlib);
    INCLUDE(dtr);
    INCLUDE(sort);
    INCLUDE(classes);

    args = args || {};
    if (!(args.name || args.type || args.tier || args.class || args.cost)) {
        var balance = #s.accts.balance();
        args.cost = { "$lte": balance };
    }

    var order = args.order || ["tier", "type", "name", "rarity"],
        list = #s.market.browse(args),
        market = {};

    if (list.length === 0) {
        return {
            ok: false,
            msg: "No suitable upgrades found.\nUsage: " + context.this_script +
                ' { name:"<upgrade name", type:"<lock, script_space, script>", tier:<1-4>, class:"<architect, executive, infitrator, scavenger>", cost:<num or GC str>, order:<array of properties> }'
        };
    }

    stdlib.each(list, function(_, item) {
        var id = "" + item.rarity + "-" + item.name;
        if (!(null === item.i || id in market)) {
            market[id] = item;
        }
    });

    list = [];
    for (var id in market) {
        var item = #s.market.browse({ i: market[id].i });
        for (var key in item.upgrade)
            item[key] = item.upgrade[key];
        item.class = item.up_class;
        list.push(item);
    }

    list = sort(list, order);

    var titles = [
        { name: "Name", key: "name" },
        { name: "Rarity", key: "rarity", func: dtr.coloredRarityLevel },
        { name: "Cost", key: "cost", dir: -1, func: dtr.expandGC },
        { name: "Token", key: "i" },
        { name: "Type", key: "type" },
        {
            name: "Class",
            key: "class",
            func: function(value) {
                return classes[value];
            }
        },
        { name: "Tier", key: "tier", dir: 0 }
    ];

    titles.sort(function(a, b) {
        return order.indexOf(a.key) != -1 ? order.indexOf(b.key) != -1 ? order.indexOf(a.key) - order.indexOf(b
            .key) : -1 : order.indexOf(b.key) != -1 ? 1 : 0;
    });

    return {
        ok: true,
        msg: dtr.columns(list, titles, { pre: "", suf: "" }, true)
    };
}
