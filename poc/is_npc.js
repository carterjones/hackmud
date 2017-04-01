function(context, args) { // name:""

    INCLUDE(is_npc);

    if (!args || !args.name) {
        return {
            ok: false,
            msg: "Usage: " + context.this_script + ' { name:"' + context.caller + '" }'
        };
    }

    var result = is_npc(args.name);

    return {
        ok: true,
        msg: args.name + " is " + (result ? "NPC" : "human")
    };

}
