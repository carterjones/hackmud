function(c, a) {
    var dPr = #s.nuutec.entry({"see":"happening"}),
        dPa = #s.nuutec.entry({"see":"about_us"}),
        rePr = /(date for|continues on|of the|developments on) ([a-z0-9_]+(.sh|.exe)?)/ig,
        rePa = /(strategy )([a-z0-9_]+)/ig,
        m,
        prs = [],
        pas = [],
        ts = []
    while (m = rePr.exec(dPr)) {
        prs.push(m[2])
    }
    while (m = rePa.exec(dPa)) {
        pas.push(m[2])
    }
    prs.forEach(function(p) {
        ts.push(#s.nuutec.entry({see:"employees", p:pas[0], project:p}))
    })
    return ts
}
