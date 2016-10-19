function(context,a) {
    var ls, cs,
        out = #s.bunnybat_hut.members_only({username:"cking", action:"order_qrs"})
    cs = out.filter(function(l) {
        // Exclude non-QR code entries.
        return !l.includes("missing")
    }).map(function(qrc) {
        // Drop off the empty line at the end of each QR code.
        ls = qrc.split('\n')
        ls = ls.slice(0,ls.length-1)
        return ls
    })

    var ret
    //return {
    //    t: typeof(cs[0]),
    //    c: cs[0]
    //}
    cs.forEach(function(c) {
        // TODO: convert symbols to arrays (2 bit rows per 1 symbol row)
        var symbols = "█▀▄ ",
            width = c[0].length,
            height = c.length,
            qrArray = new Array(height*2),
            r1, r2, i, j

        // Initialize qrArray.
        for (i = 0; i < height; i++) {
            // Make two new rows.
            r1 = new Array(width)
            r1.fill(0,0,width)
            r2 = new Array(width)
            r2.fill(0,0,width)
            for (j = 0; j < width; j++) {
                switch(c[i][j]) {
                    case "█":
                        r1[j] = 1
                        r2[j] = 1
                        break
                    case "▀":
                        r1[j] = 1
                        break
                    case "▄":
                        r2[j] = 1
                        break
                    //case " ": // this case is not needed, since the value is already 0
                    //    break // this case is not needed, since the value is already 0
                }
            }
            qrArray[i*2]   = r1
            qrArray[i*2+1] = r2
        }

        ret = qrArray
        return

        // TODO: extract the version
        // TODO: extract the format
        // TODO: define the 8 masks
        // TODO: apply the appropriate mask
        // TODO: identify encoding type
        // TODO: identify the length
        // TODO: parse the actual data
        // TODO: print the result
    })

    return {
        //ret:ret,
        len:ret.length
    }
}
