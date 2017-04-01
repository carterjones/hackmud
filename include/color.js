function(string, color) {
    var pre = "`" + color;
    var post = "`";

    if (color == '+') {
        pre = "`V";
    } else if (color == '!') {
        pre = "`N";
    } else if (color == '-') {
        pre = "`C";
    }

    return string.replace(/(\w+)/g, pre + "$1" + post);
}
