function(upgrade) {
    if (!upgrade) return;

    INCLUDE(color);

    var result = upgrade.name;
    if ('rarity' in upgrade) {
        result = color(result, upgrade.rarity);
    }
    return result;
}
