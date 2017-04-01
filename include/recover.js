// recover a corrupted response of a script
function(scriptor, args) {
    INCLUDE(stdlib);
    INCLUDE(regex_corrupt);

    var result = stdlib.json.ostringify(scriptor.call(args)).split(regex_corrupt);
    while (result.length > 1) {
        var info = stdlib.json.ostringify(scriptor.call(args)).split(regex_corrupt);
        info.push("");
        var iter_recover = -1;
        var iter_info = 0;
        var restored_last = -1;
        var restored = [];

        // assume same length of both outputs
        for (var index in result) {
            if (iter_recover < 0) {
                restored.push(result[index]);
                restored_last++;
                iter_recover++;
            } else {
                restored[restored_last] += info[iter_info][iter_recover++] + result[index];
            }
            iter_recover += result[index].length;
            while (iter_recover >= info[iter_info].length) {
                iter_recover -= info[iter_info++].length + 1;
            }
        }

        result = restored;
    }

    return stdlib.json.oparse(result[0]);
}
