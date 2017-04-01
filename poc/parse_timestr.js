function(context, args) { // date:""

    INCLUDE(stdlib);
    INCLUDE(parse_timestr);

    if (!args || !args.date || !args.date.match(/^\d{6}\.\d{4}$/)) {
        return {
            ok: false,
            msg: "Usage: " + context.this_script + ' { date:"' + stdlib.to_game_timestr(stdlib.get_date()) + '" }'
        };
    }

    var date = parse_timestr(args.date);

    return {
        ok: !isNaN(date.getTime()),
        msg: date.toString()
    };
}
