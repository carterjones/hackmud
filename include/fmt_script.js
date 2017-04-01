function(script) {
    if (!script) return;
    var result = script.name;

    INCLUDE(security);
    INCLUDE(access);
    INCLUDE(color_attribute);

    if (script.valid) {
        result = color_attribute(security[script.level], 1) + color_attribute(access[script.access], 1) + " " + result;
    } else {
        result = "  (" + result + ")";
    }

    return result;
}
