function(context, args) { // scriptor:#s.<scriptor>
    INCLUDE(recover);

    if (!args || !args.scriptor) {
        return {
            ok: false,
            msg: context.this_script + " { scriptor:<scriptor> [, args:<arguments>] }"
        };
    }

    return recover(args.scriptor, args.args);
}
