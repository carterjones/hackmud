function(context, args) { // greetings:"Hello World!"
    return {
        ok: true,
        msg: args.greetings || "Hello World!"
    };
}
