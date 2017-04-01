function(context, args) { // qr:<string>
    var caller = context.caller;

    if (!args || !args.qr) {
        return { ok: false, msg: context.this_script + " { qr:<string> }" };
    }

    var qr = args.qr.split('\n');

    function decode(code) {

        var pattern = {
            ' ': [0, 0],
            '\u2580': [1, 0],
            '\u2584': [0, 1],
            '\u2588': [1, 1]
        };

        function bit(x, y) {
            return pattern[code[y >> 1][x]][y & 1];
        }

        var info = {};
        info.dimension = code[0].length;
        info.version = (info.dimension - 17) >> 2;

        var tmp = 0;
        var i;
        for (i = 0; i < 5; i++) {
            tmp = (tmp << 1) | bit(i, 8);
        }
        tmp ^= 0x15;
        info.ecl = tmp >> 3;
        info.mask = tmp % 0x8;

        var masks = [
            function(x, y) { return ((x + y) & 0x1) === 0; },
            function(x, y) { return (x & 0x1) === 0; },
            function(x, y) { return (y % 3) === 0; },
            function(x, y) { return ((x + y) % 3) === 0; },
            // function (x,y) { return (((x>>1) + Math.floor(y / 3)) & 0x1) === 0;},
            function(x, y) { return (((y >> 1) + Math.floor(x / 3)) & 0x1) === 0; },
            function(x, y) { return (((x * y) & 0x1) + ((x * y) % 3)) === 0; },
            function(x, y) { return ((((x * y) & 0x1) + ((x * y) % 3)) & 0x1) === 0; },
            function(x, y) { return (((((x + y) & 0x1) + ((x * y) % 3)) & 0x1) === 0); }
        ];

        function databit(x, y) {
            return masks[info.mask](x, y) ^ bit(x, y);
        }

        function get_alignment(version) {
            var result = [];
            var step = 28 - (Math.floor(168 / (version + 7)) & 0xfe);

            var i = 4 * version + 10;
            do {
                result.unshift(i);
                i -= step;
            } while (i > 6);
            result.unshift(6);
            return result;
        }
        var alignment = get_alignment(info.version);

        function is_data(x, y) {
            if ((x == 6) || (y == 6)) return true;
            if ((x < 9) && (y < 9)) return true;
            if ((x < 9) && (y > info.dimension - 9)) return true;
            if ((x > info.dimension - 9) && (y < 9)) return true;
            if (info.version > 6) {
                if ((x < 7) && (y > info.dimension - 12)) return true;
                if ((x > info.dimension - 12) && (y < 7)) return true;
            }
            var max = alignment.length;
            for (var i = 0; i < max; i++) {
                for (var j = 0; j < max; j++) {
                    if ((i === 0 && (j === 0 || j == max - 1)) || (i == max - 1 && j === 0)) {
                        continue;
                    }
                    if ((Math.abs(x - alignment[i]) < 3) && (Math.abs(y - alignment[j]) < 3)) {
                        return true;
                    }
                }
            }
            return false;
        }

        function get_codewords(count) {
            var result = [];

            var up = true;
            var bits = 0;
            var byte = 0;
            for (var x = info.dimension - 1; x > 0; x -= 2) {
                if (x == 6) x--;
                for (var z = 0; z < info.dimension; z++) {
                    var y = up ? info.dimension - z - 1 : z;
                    for (var col = 0; col < 2; col++) {
                        if (!is_data(x - col, y)) {
                            bits++;
                            byte <<= 1;
                            if (databit(x - col, y)) {
                                byte |= 1;
                            }
                            if (bits == 8) {
                                result.push(byte);
                                bits = 0;
                                byte = 0;
                                if (--count === 0) {
                                    return result;
                                }
                            }
                        }
                    }
                }
                up = !up;
            }
            return result;
        }

        /* beautify preserve:start */
        var blocks = [[
        // Medium
            null, [1, 16], [ 1, 28], [ 1, 44], [ 2, 64], [ 2, 86], [ 4, 108], [ 4, 124],
            [ 4, 154], [ 5, 182], [ 5, 216], [ 5, 254], [ 8, 290], [ 9, 334],
            [ 9, 365], [ 10, 415], [ 10, 453], [ 11, 507], [ 13, 563], [ 14, 627],
            [ 16, 669], [ 17, 714], [ 17, 782], [ 18, 860], [ 20, 914], [ 21, 1000],
            [ 23, 1062], [ 25, 1128], [ 26, 1193], [ 28, 1267], [ 29, 1373],
            [ 31, 1455], [ 33, 1541], [ 35, 1631], [ 37, 1725], [ 38, 1812],
            [ 40, 1914], [ 43, 1992], [ 45, 2102], [ 47, 2216], [ 49, 2334]
        ],[
        // Low
            null, [ 1, 19], [ 1, 34], [ 1, 55], [ 1, 80], [ 1, 108], [ 2, 136],
            [ 2, 156], [ 2, 194], [ 2, 232], [ 4, 274], [ 4, 324], [ 4, 370],
            [ 4, 428], [ 4, 461], [ 6, 523], [ 6, 589], [ 6, 647], [ 6, 721],
            [ 7, 795], [ 8, 861], [ 8, 932], [ 9, 1006], [ 9, 1094], [ 10, 1174],
            [ 12, 1276], [ 12, 1370], [ 12, 1468], [ 13, 1531], [ 14, 1631],
            [ 15, 1735], [ 16, 1843], [ 17, 1955], [ 18, 2071], [ 19, 2191],
            [ 19, 2306], [ 20, 2434], [ 21, 2566], [ 22, 2702], [ 24, 2812],
            [ 25, 2956]
        ],[
        // High
            null, [ 1, 9], [ 1, 16], [ 2, 26], [ 4, 36], [ 4, 46], [ 4, 60], [ 5, 66],
            [ 6, 86], [ 8, 100], [ 8, 122], [ 11, 140], [ 11, 158], [ 16, 180],
            [ 16, 197], [ 18, 223], [ 16, 253], [ 19, 283], [ 21, 313], [ 25, 341],
            [ 25, 385], [ 25, 406], [ 34, 442], [ 30, 464], [ 32, 514], [ 35, 538],
            [ 37, 596], [ 40, 628], [ 42, 661], [ 45, 701], [ 48, 745], [ 51, 793],
            [ 54, 845], [ 57, 901], [ 60, 961], [ 63, 986], [ 66, 1054], [ 70, 1096],
            [ 74, 1142], [ 77, 1222], [ 81, 1276]
        ],[
        // Quater
            null, [1, 13], [ 1, 22], [ 2, 34], [ 2, 48], [ 4, 62], [ 4, 76], [ 6, 88],
            [ 6, 110], [ 8, 132], [ 8, 154], [ 8, 180], [ 10, 206], [ 12, 244],
            [ 16, 261], [ 12, 295], [ 17, 325], [ 16, 367], [ 18, 397], [ 21, 445],
            [ 20, 485], [ 23, 512], [ 23, 568], [ 25, 614], [ 27, 664], [ 29, 718],
            [ 34, 754], [ 34, 808], [ 35, 871], [ 38, 911], [ 40, 985], [ 43, 1033],
            [ 45, 1115], [ 48, 1171], [ 51, 1231], [ 53, 1286], [ 56, 1354],
            [ 59, 1426], [ 62, 1502], [ 65, 1582], [ 68, 1666]
        ]];
        /* beautify preserve:end */

        var counts = blocks[info.ecl][info.version];

        var words = get_codewords(counts[1]);

        // var [ c, all ] = counts;
        var c = counts[0];
        var all = counts[1];
        tmp = [];
        for (i = 0; i < c; i++) {
            tmp.push([]);
        }
        var remain = all % c;
        for (i = 0; i < all - remain; i++) {
            tmp[i % c].push(words[i]);
        }
        for (i = remain; i > 0; i--) {
            tmp[c - i].push(words[all - i]);
        }
        blocks = [];
        for (i = 0; i < c; i++) {
            blocks = blocks.concat(tmp[i]);
        }

        var cursor = 0;

        function getbits(count) {
            var result = 0;
            while (count > 0) {
                var tmp = Math.min(count, (8 - (cursor & 0x7)));
                result = (result << tmp) | ((blocks[cursor >> 3] >> (8 - (cursor & 0x7) - tmp)) & ((1 << tmp) - 1));
                cursor += tmp;
                count -= tmp;
            }
            return result;
        }

        function getbytes() {
            var count;
            if (info.version < 10) {
                count = getbits(8);
            } else {
                count = getbits(16);
            }
            var result = "";
            while (count--) {
                result += String.fromCharCode(getbits(8));
            }
            return result;
        }

        var results = [];
        while (cursor / 8 < blocks.length) {
            var encoding = getbits(4);
            if (encoding === 0) {
                return results;
            } else if (encoding == 4) {
                results.push(getbytes());
            } else {
                return results;
            }
        }

        return results;
    }

    return decode(qr);
}
