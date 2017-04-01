function(a, b, comperator) {
    var i, result;

    INCLUDE(stdlib);

    // add compare two elements
    if (!stdlib.is_def(comperator)) {
        return a < b ? -1 : a > b ? 1 : 0;
    } else if (stdlib.is_func(comperator)) {
        return comperator(a, b);
    } else if (stdlib.is_int(comperator)) {
        return sign(comperator) * cmp(a[abs(comperator)], b[abs(comperator)]);
    } else if (stdlib.is_str(comperator)) {
        // var [_, sign, key] = comperator.match(/([+-]?)(.*)/);
        var match = comperator.match(/([+-]?)(.*)/);
        var key = match[2];
        var multiplicator = match[1] == "-" ? -1 : 1;
        return multiplicator * cmp(a[key], b[key]);
    } else if (stdlib.is_arr(comperator)) {
        result = 0;
        for (i in comperator) {
            result = cmp(a, b, comperator[i]);
            if (0 !== result) break;
        }
        return result;
    } else if (stdlib.is_obj(comperator)) {
        result = 0;
        for (i in comperator) {
            result = cmp(a[i], b[i], comperator[i]);
            if (0 !== result) break;
        }
        return result;
    }
    return 0;
}
