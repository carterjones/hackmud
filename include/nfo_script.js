function(script_name) {
    var result = { name: script_name, valid: false };

    INCLUDE(stdlib);

    var tmp = #s.scripts.get_level(result);
    if (stdlib.is_int(tmp)) {
        result.valid = true;
        result.access = #s.scripts.get_access_level(result);
        result.level = tmp;
    }

    return result;
}
