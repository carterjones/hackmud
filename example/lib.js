function(context, args) {

    // Example function
    function subtraction(minuend, subtrahend) {
        return minuend - subtrahend;
    }

    // Export the symbols
    return {
        difference: subtraction
    };
}
