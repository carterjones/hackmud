function(coloring, length) {
    INCLUDE(color);

    var result = coloring[0];
    if (length) {
        result = result.substr(0, length);
    }

    return color(result, coloring[1]);
}
