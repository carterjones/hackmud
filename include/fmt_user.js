function(user) {
    if (!user) return;
    var result = user.name;
    if (user.valid) {} else {
        result = " (" + result + ")";
    }
    return result;
}
