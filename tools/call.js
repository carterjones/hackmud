function(context, args) { // scriptor:#s.<scriptor>
    INCLUDE(nfo_operand);
    INCLUDE(stdlib);
    INCLUDE(nfo_script);

    if (!args || !args.scriptor) {
        return {
            ok: false,
            msg: context.this_script + " { scriptor:<scriptor> [, args:<arguments>, nfo:true, decolor:true] }"
        };
    }

    var scriptor = args.scriptor;
    var result = scriptor.call(args.args);

    if (args.nfo) {
        result = nfo_operand(result);
    }

    if (args.decolor) {
        result = stdlib.json.ostringify(result);
        result = result.replace(/([!`+-])(\w+)\1/g, "$1 $2$1");
        result = stdlib.json.oparse(result);
    }

    return {
        info: nfo_script(scriptor.name),
        result: result
    };
}
