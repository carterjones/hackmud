function(operand) {
    var result = typeof(operand);
    switch (result) {
        case 'string':
        case 'number':
            result += " (" + operand + ")";
            break;
        case 'object':
            var key;
            if (operand instanceof Array) {
                result = [];
                for (key in operand) {
                    result.push(nfo_operand(operand[key]));
                }
            } else {
                result = {};
                for (key in operand) {
                    result[key] = nfo_operand(operand[key]);
                }
            }
            break;
    }
    return result;
}
