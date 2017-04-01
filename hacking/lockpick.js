// length 809 chars/ comprimised 565 chars
// Improvements:
// - remove dtr import (15)
// - remove return (25)
// - interating over 2-99 for ez_prime (~89) (not recommended heavy runtime)
// - for color_complement or triad iterating over colors (95)
// doing all shrinks to 340 chars

function(context, args) { // lock:#s.<user>.<script>
    var lock = args.lock;
    var d = #s.dtr.lib();
    var commands = ["unlock", "release", "open"];
    var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    var color = ["red", "lime", "blue", "orange", "green", "purple", "yellow", "cyan"];
    args = {};
    var type = "",
        tmp, result = "",
        index;

    do {
        tmp = result.match(/`N(\w+)`.*$/);
        if (tmp) {
            type = tmp[1];
            index = 0;
        }
        if (type[0] == "E") { // EZ_xx
            args[type] = commands[index++];
        }
        if (type[0] == "d") { // digit
            args[type] = index++;
        }
        if (type[0] == "e") { // ez_prime
            args[type] = primes[index++];
        }
        if (type[0] == "c") { // c00x
            args[type] = color[index++];
            if (type[3] == "1") { // c001
                args.color_digit = args[type].length;
            } else if (type[3] == "2") { // c002
                args.c002_complement = color[(index + 3) % 8];
            } else if (type[3] == "3") { // c003
                args.c003_triad_1 = color[(index + 6) % 8];
                args.c003_triad_2 = color[index];
            }
        }
        result = lock.call(args);
    } while (!result.match(/terminated/));

    return {
        ok: true,
        msg: d.pp(args)
    };
}
