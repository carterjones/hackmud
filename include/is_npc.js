// check if user is an npc
function(name) {
    var last_action = #s.users.last_action({ name: [name, "gibson"] });
    return last_action[0] && last_action[0].t.getTime() == last_action[1].t.getTime();
}
