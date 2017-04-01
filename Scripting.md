# Scripting

## Basics

### Scriptor

## Database (`#db`)

## Standard Library (`#s.scripts.lib()`)

| Function | Description |
| --- | --- |
| `ok()` | Helper that returns `{ ok:true }`. You can use it in your script as return Value. |
| `not_impl()` | Helper that returns `{ ok:false, msg:"not implemented" }` |
| `log(item)` | Adds the `item` to an Array of logmessages, you can use it insteed of `<stdout>`. See `get_log`.|
| `get_log()` |  Returns the array of logmessages, you putted with `log`. |
| `rand_int(min, max)` | Returns a random integer between `min` and `max`. |
| `are_ids_eq` | |
| `is_obj(item)` | Returns `true` if `item` is an `Object` |
| `is_str` | |
| `is_num` | |
| `is_int` | |
| `is_neg` | |
| `is_arr` | |
| `is_func` | |
| `is_def` | |
| `is_valid_name` | |
| `dump` | |
| `clone` | |
| `merge` | |
| `get_values` | |
| `hash_code` | |
| `to_gc_str` | |
| `to_gc_num` | |
| `to_game_timestr(date)` | formats `date` like `YYMMDD.HHMM` |
| `cap_str_len` | |
| `each` | |
| `select` | |
| `count` | |
| `select_one` | |
| `map` | |
| `shuffle` | |
| `sort_asc` | |
| `sort_desc` | |
| `num_sort_asc` | |
| `num_sort_desc` | |
| `max_val_index` | |
| `add_time` | |
| `security_level_names` | |
| `get_security_level_name` | |
| `create_rand_string` | |
| `get_user_from_script(script)` | returns teh user part of a scriptname like `<user>.<script>` |
| `u_sort_num_arr_desc` | |
| `can_continue_execution` | |
| `can_continue_execution_error` | |
| `date` | |
| `get_date` | |
| `get_date_utcsecs` | |
| `math` | |
| `array` | |
| `parse_int` | |
| `parse_float` | |
| `json` | |
