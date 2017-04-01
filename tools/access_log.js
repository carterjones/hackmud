function(context, args) {
    var log = #s.sys.access_log();

    INCLUDE(stdlib);
    INCLUDE(dtr);
    INCLUDE(parse_timestr);
    INCLUDE(nfo_user);
    INCLUDE(nfo_script);
    INCLUDE(fmt_user);
    INCLUDE(fmt_date);
    INCLUDE(fmt_script);
    INCLUDE(color);

    var result = [];

    stdlib.each(log, function(_, entry) {
        var match = entry.msg.match(/ from (\w+\.\w+)$/);
        if (match) {
            entry.from = nfo_script(match[1]);
        }
        match = entry.msg.match(/^(Connection|Breach attempt|System access) from /);
        if (match) {
            if (match[1].match(/attempt/i)) {
                entry.type = "attempt";
                entry.level = 2;
            } else if (match[1].match(/access/i)) {
                entry.type = "access";
                entry.level = 3;
            } else {
                entry.type = "connect";
                entry.level = entry.from.valid ? 1 : 0;
            }
        }
        match = entry.msg.match(/^(\w+\.\w+) execution from /);
        if (match) {
            entry.type = "exec";
            entry.script = nfo_script(match[1]);
            entry.level = 4;
            if (match[1] === "sys.write_log") {
                entry.args = result.pop().msg;
            }
        }
        result.push(entry);
    });

    if (context.is_scriptor || context.calling_script) {
        return result;
    }

    result = result.filter(function(entry) {
        return entry.level > 0;
    });

    var titles = [
        { name: color("date", 'V'), key: "t", func: fmt_date },
        { name: color("from", 'V'), key: "from", func: fmt_script },
        { name: color("type", 'V'), key: "type" },
        { name: color("script", 'V'), key: "script", func: fmt_script },
        { name: color("args", 'V'), key: "args" }
    ];

    return {
        ok: true,
        msg: dtr.columns(result, titles, { pre: "", suf: "" }, true)
    };
}
