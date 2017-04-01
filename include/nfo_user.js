function(user_name) {
    var result = { name: user_name, valid: false };

    var last_action = #s.users.last_action({ name: [user_name, "gibson"] });
    if (last_action[0]) {
        result.valid = true;
        result.last_action = last_action[0].t;
        result.npc = last_action[0].t.getTime() == last_action[1].t.getTime();
    }

    return result;
}
