function(context, args) { // t: #s.username.target
    // Handle the case with no arguments passed.
    if (args === null) {
        // Get all FULLSEC targets.
        var fullsec_targets = #s.scripts.fullsec();

        // Get the publics and entries.
        var publics_and_entries = fullsec_targets.filter(function(v) {
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
            fullsec_targets: publics_and_entries
        };
    }

    // Extract the banner of the script.
    var banner = args.t.call().split("\n");

    // Extract the pages from the banner using the following process:
    // - take the last line of the banner, which is where the list of pages is
    // - split the pages up using the '|' character
    // - trim off whitespace from each page name
    // - remove any empty entries from the resulting list
    var pages = banner[banner.length - 1]
        .split("|").map(function(v) {
            return v.trim();
        }).filter(function(v) {
            return v.length > 0;
        });

    if (pages !== null) {
        return pages;
    }

    // Prepare a variable to hold arguments that will be passed to the function passed in to this script.
    var function_args = {};

    // Create a generic output variable.
    var output_generic = args.t.call({});

    // Parse the output of the function with no parameters passed in.
    var no_parameters_result = output_generic.match(/with ([a-z]+):"([a-z]+)"/i);

    // This is a flag that can be set to a string to indicate the script should stop.
    var stop_flag = null;

    // Add a check based on some money theft scripts that all shared parsing errors.
    if (no_parameters_result === null) {
        return {
            error: "Parsing failed: this is a potentially malicious server. If the glitches in out1 and out2 look the same, then it is almost certainly malicious.",
            out1: output_generic,
            out2: args.t.call({})
        };
    }

    // Extract the command used to view pages.
    var view_command = no_parameters_result[1];

    // Extract the codeword needed to access the projects.
    var codeword = no_parameters_result[2];

    // Define a regex for projects, passwords, and users.
    var regex_projects = /(date for|continues on|of the|developments on) ([a-z0-9_]+(.sh|.exe)?)/ig;
    var regex_passwords = /(strategy )([a-z0-9_]+)/ig;
    var regex_users = /([a-z0-9_]+) (of project|when being)/ig;

    // Declare iteration variables and arrays that are used later.
    var m, i;
    var projects = [];
    var passwords = [];
    var users = [];
    var targets = [];

    // Look for projects and passwords in each of the pages.
    pages.forEach(function(v) {
        function_args = {};
        // Craft the arguments that will be called.
        // e.g.: {"see":"about_us"}
        function_args[view_command] = v;

        // Call the function with the custom arguments.
        output_generic = args.t.call(function_args);

        // Search for projects.
        do {
            m = regex_projects.exec(output_generic);
            projects.push(m[2]);
        } while (m !== null);

        // Search for passwords.
        do {
            m = regex_passwords.exec(output_generic);
            passwords.push(m[2]);
        } while (m !== null);

        // Search for users.
        do {
            m = regex_users.exec(output_generic);
            users.push(m[1]);
        } while (m !== null);
    });

    // Gather the results from each of the projects (and assume only one password was found).
    projects.forEach(function(p) {
        // Call the function with the custom arguments.
        // Note: The password parameter can either be p, pass, or password.
        //       Therefore, we pass in all three, since it ignores unneeded parameters.
        cw_key = [view_command];
        output_generic = args.t.call({
            p: passwords[0], // password
            pass: passwords[0], // password
            password: passwords[0], // password
            project: p, // project
            cw_key: codeword, // codeword
        });

        // Parse each entry and filter out none, empty, nil, error, etc.
        if (typeof(output_generic) == "string") {
            output_generic = output_generic.split("\n");
        }

        output_generic.forEach(function(e) {
            // Make prefer unidentified entries (they seem to have more success).
            if (e && e.includes(".") && e.includes("_")) {
                targets.push(e);
            }
        });
        if (targets.length > 0) {
            var safety = #s.scripts.get_level({ name: targets[0] });
            if (safety != 4) { // 4 = FULLSEC
                stop_flag = "STOP. THIS IS MALICOUS.";
                return;
            }
        }
    });

    if (stop_flag !== null) {
        return stop_flag;
    }

    // Gather matching HIGHSEC and MIDSEC targets.
    var hms = #s.scripts.highsec().concat(#s.scripts.midsec()),
        t2_ts = [],
        user = args.t.name.split(".")[0];

    for (i = 0; i < hms.length; i++) {
        if (hms[i].includes(user)) {
            t2_ts.push(hms[i]);
        }
    }

    return {
        t1_ts: targets,
        users: users,
        t2_ts: t2_ts
    };
}
