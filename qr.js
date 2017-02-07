function(context,a) {
    var ls,
        
        //out = #s.bunnybat_hut.memberlogin({username:"scook", navigation:"order_qrs"}),
        //out = #s.bunnybat_hut.members_only({username:"m_c_fly", get:"order_qrs"}),
        //out = #s.bunnybat_hut.members({username:"sammy_l_jack", cmd:"order_qrs"}),
        //out = #s.setec_gas.members_only({username:"lion_eyes", process:"order_qrs"}),
        //out = #s.setec_gas.member_access({username:"scook", get:"order_qrs"}),
        //out = #s.setec_gas.memberlogin({username:"oz", get:"order_qrs"}),
        out = #s.setec_gas.memberlogin({username:"cheechfiend91", get:"order_qrs"}),
        //out = #s.soylentbean.member_access({username:"mjay_m_walker", action:"order_qrs"}),
        //out = #s.suborbital_airlines.members({username:"bobranator", get:"order_qrs"}),
        //out = #s.suborbital_airlines.members_only({username:"rocky_b", command:"order_qrs"}),
        //out = #s.weyland.members_only({username:"m_clarke_dunk", see:"order_qrs"}),
        cs = out.filter(function(l) {
            // Exclude non-QR code entries.
            return !l.includes("missing")
        }).map(function(qrc) {
            // Drop off the empty line at the end of each QR code.
            ls = qrc.split('\n')
            ls = ls.slice(0,ls.length-1)
            return ls
        }),
        ret = "",
        //ret = out + "\n",
        c = cs[0]
    //cs = [cs[3]]

    cs.forEach(function(c) {
        var width = c[0].length,
            h = c.length*2, // height
            qra = new Array(h), // QR Array
            r1, r2, i, j, version, fi = 0, ecl, dataMask, ecc

        function qrToString() {
            var qr2 = "", line, x
            for (i = 0; i < h; i++) {
                line = ""
                for (j = 0; j < h; j++) {
                    x = qra[i][j]
                    if (x == -1) {
                        line += "X"
                    } else if (x == -2) {
                        line += "M"
                    } else if (x == 0) {
                        line += "█" // "1"
                    } else if (x == 1) {
                        line += " " // "0"
                    } else {
                        line += x
                    }
                }
                qr2 += line + "\n"
            }
            return qr2
        }

        // Convert symbols to arrays (2 bit rows per 1 symbol row)
        for (i = 0; i < h/2; i++) {
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
            qra[i*2]   = r1
            qra[i*2+1] = r2
        }

        // Drop off the last line filled with zeros.
        qra = qra.slice(0, qra.length-1)
        h--

        // Print the QR code, along with markers for post-processing.
        ret += "===BEGIN QR CODE===\n"
        ret += qrToString() + "\n"
        ret += "===END QR CODE===\n"

        // Calculate the version.
        version = Math.floor((h - 17) / 4)

        // Calculate the error correction level. 
        ecl = qra[8][0] + qra[8][1]*2

        // Calculate the data mask.
        dataMask = qra[8][2] + qra[8][3]*2 + qra[8][3]*3

        // Define the error correction levels.
        // L = 3
        // M = 2 // not sure if these levels need to be switched
        // Q = 1 // not sure if these levels need to be switched
        // H = 0
        // More info here:
        // - http://blog.qrstuff.com/2011/12/14/qr-code-error-correction
        // - http://www.qrcoded.co.uk/qr-code-error-correction-levels/
        ecc = {
            // L
            3: {
                7: 156,
                8: 194,
                9: 232
            },
            // M
            2: {
                7: 124,
                8: 154,
                9: 182
            },
            // Q
            1: {
                7: 88,
                8: 110,
                9: 132
            },
            // H
            0: {
                7: 66,
                8: 86,
                9: 100
            }
        }

        // TODO: Investigate these. I still think these are not defined correctly.
        // Define the 8 masks.
        // i = row, j = col
        function isMasked(mask, row, col) {
            // Masks are defined using the information here:
            // https://en.wikipedia.org/wiki/QR_code#/media/File:QR_Format_Information.svg
            // black = 1, white = 0
            switch (mask) {
                // case 0: return ((i*j) % 2) + ((i*j) % 3) == 0
                // case 1: return i % 2 == 0
                // case 2: return ((i*j) %3 + i + j) % 2 == 0
                // case 3: return (i+j) % 3 == 0
                // case 4: return (Math.floor(i/2) + Math.floor(j/3)) % 2 == 0
                // case 5: return (i+j) % 2 == 0
                // case 6: return ((i*j) %3 + i * j) % 2 == 0
                // case 7: return j % 3 == 0
                // case 1:
                // case 2:
                // case 4:
                // case 3:
                // case 7:
                // // return (j % 3) == 0
                // // return (((i * j) % 2 + (i * j) % 3) % 2) == 0
                // // return (((i * j) % 3 + (i + j) % 2) % 2) == 0
                // // confirmed the following via bruteforce
                // //case 0: return ((i * j) % 2 + (i * j) % 3) == 0       // # confirmations: 1
                // case 0: return ((i + j) % 2) == 0                       // # confirmations: 1
                // //case 1: return (i % 2) == 0                           // # confirmations: 1
                // case 5: return (Math.floor((i / 2) + (j / 3)) % 2) == 0 // # confirmations: 1, 2 
                // case 6: return ((i + j) % 3) == 0                       // # confirmations: 1, 2
                case 0: return (row + col) % 2 == 0                                 // confirmed for 00000000, 44444444, 5
                case 1: return row % 2 == 0                                         // confirmed for 11
                case 2: return col % 3 == 0                                         // confirmed for 
                case 3: return (row + col) % 3 == 0                                 // confirmed for 
                case 4: return (Math.floor(row / 2) + Math.floor(col / 3)) % 2 == 0 // confirmed for 
                case 5: return ((row * col) % 2) + ((row * col) % 3) == 0           // confirmed for 22   333333, 55, 7777777
                case 6: return (((row * col) % 2) + ((row * col) % 3)) % 2 == 0     // confirmed for 22,  333,       777
                case 7: return (((row + col) % 2) + ((row * col) % 3)) % 2 == 0     // confirmed for 
            }
        }
        var x
        // Apply the appropriate mask (flip the bits)
        for (j = h-1; j >= 0; j--) {
            for (i = h-1; i >= 0; i--) {
                if (isMasked(dataMask, j, i)) {
                    if (qra[j][i] == 0) {
                        qra[j][i] = 1
                    } else {
                        qra[j][i] = 0
                    }
                }
            }
        }

        // Calculate the encoding.
        var enc = qra[h-1][h-1]
        enc = (enc * 2) + qra[h-1][h-2]
        enc = (enc * 2) + qra[h-2][h-1]
        enc = (enc * 2) + qra[h-2][h-2]
        if (enc == 4) {
            ret += "valid mask: " + dataMask + "\n"
        }

        // Debug data. TODO: Remove this.
        ret += qrToString() + "\n"

        // ar = avoid region
        // Avoid the region by marking it as non-traversable.
        function ar(x, y, w, h) {
            for (i = x; i < x+w; i++) {
                for (j = y; j < y+h; j++) {
                    qra[j][i] = -1
                }
            }
        }

        // Avoid corners. This includes version info.
        ar(  0,   0, 9, 9) // top left
        ar(h-8,   0, 8, 9) // top right
        ar(  0, h-8, 9, 8) // bottom left

        // Avoid alignment markers.
        var hh = Math.floor(h/2)-2 // half height (roughly)
        ar( hh,   4, 5, 5) // top middle
        ar(  4,  hh, 5, 5) // center left
        ar( hh,  hh, 5, 5) // center middle
        ar(h-9,  hh, 5, 5) // center right
        ar( hh, h-9, 5, 5) // bottom middle
        ar(h-9, h-9, 5, 5) // bottom right

        // Avoid timing patterns. Go edge-to-edge to save characters.
        ar(6, 0, 1, h) // vertical
        ar(0, 6, h, 1) // horizontal

        // Avoid versions.
        ar(   0, h-11, 6, 3) // vertical
        ar(h-11,    0, 3, 6) // horizontal

        // Debug data. TODO: Remove this.
        //ret += qrToString() + "\n"

        // Parse the data.
        var byte = 0,
            numId = 0,
            len = -1,
            numBits = 0,
            bytes = [],
            result = "",
            goingUp = true,
            rightCol = h-1,
            jcc = false, // just changed columns
            reachedEnd = false
        for (j = h-3; ; ) {
            for (i = rightCol; i >= rightCol-1; i--) {
                if (rightCol < 0) {
                    // This if statement should never happen unless the parser is broken.
                    reachedEnd = true
                    break
                }
                // This is a fancy for loop to handle two columns, starting with
                // the right column.
                x = qra[j][i]
                // Make sure this is valid data (not masked or marked for avoiding).
                if (x >= 0) {
                    numBits++
                    byte = (byte << 1) + qra[j][i]
                    if (len == -1) {
                        qra[j][i] = "L"
                    } else {
                        qra[j][i] = String.fromCharCode(numId+97)
                    }
                    if (numBits == 4 && byte == 0) {
                        qra[j][i] = "E"
                        reachedEnd = true
                        break
                    }
                    if (numBits == 8) {
                        // Save the byte.
                        bytes.push(byte)
                        numId = (numId+1) % 10
                        //result += String.fromCharCode(byte)

                        // Reset variables.
                        numBits = 0
                        byte = 0
                    }
                }
            }
            if (reachedEnd) {
                break
            }

            if (j == 0) {
                if (jcc) {
                    jcc = false
                    j++
                    goingUp = false
                } else {
                    rightCol -= 2
                    jcc = true
                }
            } else if (j == h-1) {
                if (jcc) {
                    jcc = false
                    j--
                    goingUp = true
                } else {
                    rightCol -= 2
                    jcc = true
                }
            } else if (goingUp) {
                j--
            } else {
                j++
            }
        }

        // Rearange the codewords.
        var nb, results = []
        for (nb = 2; nb < 5; nb++) {
            var numBlocks = nb,
                currentBlock = 0,
                blocks = [],
                result = "",
                hi, lo
            // Initialize the blocks.
            for (i = 0; i < numBlocks; i++) {
                blocks.push([])
            }
            for (i = 0; i < bytes.length; i++) {
                // Move to the next block.
                if (++currentBlock == numBlocks) {
                    currentBlock = 0
                }
                // Add the current byte to the current block.
                blocks[currentBlock].push(bytes[i])
            }
            // Iterate through the blocks and make a new byte array.
            var bytes2 = []
            for (i = 0; i < numBlocks; i++) {
                // Add each byte from the current block to the new byte array.
                for (j = 0; j < blocks[i].length; j++) {
                    bytes2.push(blocks[i][j])
                }
            }
            // Iterate through the new byte array, making a third byte array based on the low and high values of each adjacent byte.
            // We can skip the encoding (the first low), since it is already known, as well as the last high byte because we just don't care right now.
            var bytes3 = []
            for (i = 0; i < bytes2.length-1; i++) {
                lo = bytes2[i]  >> 4
                hi = (bytes2[i+1] & 15) << 4
                var b = lo + hi
                bytes3.push(b)
                result += String.fromCharCode(b)
            }
            results.push(result)
        }

        //ret += qrToString() + "\n"
        if (enc != 4) {
            ret += "Not byte encoded.\n"
        }
        ret += "blocks: " + blocks + "\n"
        ret += "blocks[0]: " + blocks[0] + "\n"
        ret += "blocks[1]: " + blocks[1] + "\n"
        ret += "     ecl: " + ecl + "\n"
        ret += "datamask: " + dataMask + "\n"
        ret += " version: " + version + "\n"
        ret += "maxwords: " + ecc[ecl][version] + "\n"
        ret += "encoding: " + enc + "\n"
        ret += "  length: " + len + "\n"
        ret += "   bytes: " + bytes + "\n"
        ret += "  bytes2: " + bytes2 + "\n"
        ret += "  bytes3: " + bytes3 + "\n"
        //ret += " qra.len: " + qra.length + "\n"
        //ret += "brcorner: " + qra[h-1][h-1] + "\n"
        //ret += "[h-1][h-1]: " + qra[h-1][h-1] + "\n"
        //ret += "[h-1][h-2]: " + qra[h-1][h-2] + "\n"
        //ret += "[h-2][h-1]: " + qra[h-2][h-1] + "\n"
        //ret += "[h-2][h-2]: " + qra[h-2][h-2] + "\n"
        ret += "bytes.length: " + bytes.length + "\n"
        ret += "results: " + results

        return ret
    })

    return ret // + cs.length + "\n"

    // Useful links:
    // - http://www.thonky.com/qr-code-tutorial/format-version-information
    // - http://www.thonky.com/qr-code-tutorial/mask-patterns
    // - https://github.com/zxing/zxing/blob/master/core/src/main/java/com/google/zxing/qrcode/decoder/DataMask.java#L129-L137
    // - https://github.com/zxing/zxing/blob/master/core/src/main/java/com/google/zxing/qrcode/decoder/Version.java#L139-L176
    // - https://github.com/zxing/zxing/blob/master/core/src/main/java/com/google/zxing/qrcode/decoder/BitMatrixParser.java#L164
    // - https://github.com/dlbeer/quirc/blob/master/lib/decode.c
    
    // With ECC, the data blocks (8 bits) are interleaved
    // so, if you just decode the bistream directly, the result is something like this:
    // [data0][data4][data1][data5][data2][data6][data3][data7][ecc0][ecc4][ecc1][ecc5][ecc2][ecc6][ecc3][ecc7]
    // ( that might not be exactly right, but that's the idea )
    // but data 0 contains the 4 bits of type information, and then 4 bits of the length
    // the OTHER 4 bits of the length, and the first 4 bits of payload, are in data1
    // the rest of THAT data byte is in data2, and so on.
}
