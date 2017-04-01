function(context, args) {
    var log = #s.sys.upgrade_log();

    INCLUDE(stdlib);
    INCLUDE(dtr);
    INCLUDE(parse_timestr);
    INCLUDE(nfo_user);
    INCLUDE(fmt_user);
    INCLUDE(fmt_date);
    INCLUDE(fmt_upgrade);

    var result = [];

    stdlib.each(log, function(_, line) {
        var entry = { line: line };
        var match = line.match(/^(\d{6}\.\d{4})\s+(.*)$/);
        if (match) {
            entry.date = parse_timestr(match[1]);
            entry.line = line = match[2];
        }
        match = line.match(/\s+(from|to)\s+(\w+)$/);
        if (match) {
            entry.counterpart = nfo_user(match[2]);
            entry.direction = (match[1] == 'to' ? '<' : '>');
        }
        match = line.match(/^`(\d)(\w+)`\s+\((\w+)\)\s+/);
        if (match) {
            entry.upgrade = {
                rarity: +match[1],
                name: match[2],
                sn: match[3]
            };
        }
        result.push(entry);
    });

    if (context.is_scriptor || context.calling_script) {
        return result;
    }

    var titles = [
        { name: "+date+", key: "date", func: fmt_date },
        { name: "+counterpart+", key: "counterpart", func: fmt_user },
        { name: "", key: "direction" },
        { name: "+upgrade+", key: "upgrade", func: fmt_upgrade }
    ];

    return {
        ok: true,
        msg: dtr.columns(result, titles, { pre: "", suf: "" }, true)
    };
}
