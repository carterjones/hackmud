function(array, order) {
    // sort with given order
    INCLUDE(stdlib);
    INCLUDE(cmp);

    if (stdlib.is_func(order)) {
        return array.sort(order);
    }
    return array.sort(function(a, b) {
        return cmp(a, b, order);
    });
}
