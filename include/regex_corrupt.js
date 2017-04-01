// regular expression of corrupt char
INCLUDE(stdlib);

new RegExp("`[" + stdlib.colors + "][" + stdlib.corruption_chars + "]`", "g")
    // or static
    // /`\w[¡¢£¤¥¦§¨©ª]`/g
