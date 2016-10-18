function(context,a) {
    var ls, cs,
        out = #s.suborbital_airlines.members({username:"jack_sparrow", command:"order_qrs"})
    cs = out.filter(function(l) {
        // Exclude non-QR code entries.
        return !l.includes("missing")
    }).map(function(qrc) {
        // Drop off the empty line at the end of each QR code.
        ls = qrc.split('\n')
        ls = ls.slice(0,ls.length-1)
        return ls
    })

    cs.forEach(function(c) {
        // TODO: convert symbols to arrays (2 bit rows per 1 symbol row)
        // TODO: extract the version
        // TODO: extract the format
        // TODO: define the 8 masks
        // TODO: apply the appropriate mask
        // TODO: identify encoding type
        // TODO: identify the length
        // TODO: parse the actual data
        // TODO: print the result
    })

    return cs
}
