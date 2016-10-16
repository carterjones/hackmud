function (c, a)
{
    // Get all FULLSECs.
    var f = #s.scripts.fullsec();

    // Get the publics and entries.
    var l = f.filter(function(v){
        return v.includes("pub") || v.includes("entry")
    })
    return l
}
