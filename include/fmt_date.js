function(date) {
    INCLUDE(stdlib);

    return stdlib.to_game_timestr(stdlib.is_obj(date) ? date : new Date(date));
}
