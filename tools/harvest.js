function(context, a) // t:#s.username.target
{
    // Handle the case with no arguments passed.
    if (a === null) {
        // Get all FULLSEC targets.
        var f = #s.scripts.fullsec();

        // Get the publics and entries.
        var l = f.filter(function(v) {
            return (v.includes(".pub") || v.includes(".entry")) &&
                // Filter out known malicious entries.
                !(v.includes("accenture") ||
                    v.includes("arino") ||
                    v.includes("blackcore") ||
                    v.includes("blackstar") ||
                    v.includes("dynamo_corp") ||
                    v.includes("jinteki_corp") ||
                    v.includes("l4sh") ||
                    v.includes("lunar_systems") ||
                    v.includes("n_inc") ||
                    v.includes("onion") ||
                    v.includes("perimeter_systems") ||
                    v.includes("ploogle") ||
                    v.includes("pwnhub") ||
                    v.includes("reinit") ||
                    v.includes("rozas")
                );
        });

        return {
            usage: "harvest{t:#s.user.target}",
            fullsec_targets: l
        };
    }

    // Define some variables.
    var b = a.t.call().split("\n"), // banner
        pages = b[b.length - 1] // take the last line of the banner
        .split("|").map(function(v) { // split the pages up
            return v.trim(); // trim whitespace
        }).filter(function(v) {
            return v.length > 0; // filter out empty results from this list
        }),
        args = {}, // arguments passed to the function passed in to this script
        out = a.t.call({}),
        out2, // generic output variable
        none = out.match(/with ([a-z]+):"([a-z]+)"/i), // parse the output of the function with no parameters passed in
        stop = null; // flag that can be set to a string to indicate the script should stop

    // Add a check based on some money theft scripts that all shared parsing errors.
    if (none === null) {
        out2 = a.t.call({});
        return {
            error: "Parsing failed: this is a potentially malicious server. If the glitches in out1 and out2 look the same, then it is almost certainly malicious.",
            out1: out,
            out2: out2
        };
    }

    // Continue defining variables.
    var cmd = none[1], // the command used to view pages
        cw = none[2], // the codeword needed to access the projects
        rePr = /(date for|continues on|of the|developments on) ([a-z0-9_]+(.sh|.exe)?)/ig, // regex for projects
        rePa = /(strategy )([a-z0-9_]+)/ig, // regex for password(s)
        reUs = /([a-z0-9_]+) (of project|when being)/ig, // regex for users
        m, i, // iteration variables that are used later
        es = [], // entries
        prs = [], // projects
        pas = [], // passwords
        us = [], // users
        ts = []; // targets

    // Look for projects and passwords in each of the pages.
    pages.forEach(function(v) {
        args = {};
        // Craft the arguments that will be called.
        // e.g.: {"see":"about_us"}
        args[cmd] = v;

        // Call the function with the custom arguments.
        out = a.t.call(args);

        // Search for projects.
        do {
            m = rePr.exec(out);
            prs.push(m[2]);
        } while (m !== null);

        // Search for passwords.
        do {
            m = rePa.exec(out);
            pas.push(m[2]);
        } while (m !== null);

        // Search for users.
        do {
            m = reUs.exec(out);
            us.push(m[1]);
        } while (m !== null);
    });

    // Gather the results from each of the projects (and assume only one password was found).
    prs.forEach(function(p) {
        // Call the function with the custom arguments.
        // Note: The password parameter can either be p, pass, or password.
        //       Therefore, we pass in all three, since it ignores unneeded parameters.
        cw_key = [cmd];
        out = a.t.call({
            p: pas[0], // password
            pass: pas[0], // password
            password: pas[0], // password
            project: p, // project
            cw_key: cw, // codeword
        });

        // Parse each entry and filter out none, empty, nil, error, etc.
        if (typeof(out) == "string") {
            out = out.split("\n");
        }
        out.forEach(function(e) {
            // Make prefer unidentified entries (they seem to have more success).
            if (e && e.includes(".") && e.includes("_")) {
                ts.push(e);
            }
        });
        if (ts.length > 0) {
            var safety = #s.scripts.get_level({ name: ts[0] });
            if (safety != 4) { // 4 = FULLSEC
                stop = "STOP. THIS IS MALICOUS.";
                return;
            }
        }
    });

    if (stop !== null) {
        return stop;
    }

    // Gather matching HIGHSEC and MIDSEC targets.
    var hms = #s.scripts.highsec().concat(#s.scripts.midsec()),
        t2_ts = [],
        user = a.t.name.split(".")[0];

    for (i = 0; i < hms.length; i++) {
        if (hms[i].includes(user)) {
            t2_ts.push(hms[i]);
        }
    }

    return {
        t1_ts: ts,
        users: us,
        t2_ts: t2_ts
    };
}
