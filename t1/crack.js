function (context, a) { // t:#s.username.target
  var ez=["open","release","unlock"],
      primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],
      colors = ["red", "orange", "yellow", "green", "lime", "blue", "cyan", "purple"],
      ret, args = {}, success=false,
      unlocked = /(LOCK_UNLOCKED)\s(ez_[0-9]{2}|c00[1-3])/g,
      locked = /LOCK_ERROR/g,
      locks = /(EZ_[0-9]{2}|c00[1-3])/g,
      lock_list = [],
      ret, i, lock // these are used later
  function check_next(args, next) {
    ret = a.t.call(args)
    if (ret.includes("is missing") || ret.includes("unlocked") || ret.includes("Denied")) {
      return true
    }
  }
  while (!success) {
    ret = a.t.call(args)
    if (!locked.test(ret)) {
      success = true
      break
    }
    while (lock = locks.exec(ret)) {
      lock_list.push(lock[1])
    }
    lock = lock_list[lock_list.length - 1].toLowerCase()
    switch (lock) {
      case "ez_21":
      case "ez_35":
      case "ez_40":
        for (i=0; i<3; i++) {
          args[lock] = ez[i]
          if (check_next(args)) { break }
        }
        // Stop processing ez_21 locks here
        if (lock == "ez_21") { break }
        else if (lock == "ez_35") {
          // Process the rest of ez_35 locks.
          for (i=0; i<10; i++) {
            args.digit = i
            if (check_next(args)) { break }
          }
        }
        else if (lock == "ez_40") {
          // Process the rest of ez_40 locks.
          for (i=0; i<primes.length; i++) {
            args.ez_prime = primes[i]
            if (check_next(args)) { break }
          }
        }
        // Stop processing ez_35 or ez_40 locks.
        break
      case "c001":
      case "c002":
      case "c003":
        // Identify the base lock value.
        for (i=0; i<8; i++) {
          args[lock] = colors[i]
          if (check_next(args)) { break }
        }
        // Stop processing c001 locks here
        if (lock == "c001") {
          for (i=0; i<10; i++) {
            args.color_digit = i
            if (check_next(args)) { break }
          }
          break
        }
        // Set the first triad value.
        for (i=0; i<8; i++) {
          if (lock == "c002") { args["c002_complement"] = colors[i] }
          if (lock == "c003") { args["c003_triad_1"]    = colors[i] }
          if (check_next(args)) { break }
        }
        // Stop processing c002 locks here
        if (lock == "c002") { break }
        // Set the second triad value.
        for (i=0; i<8; i++) {
          args["c003_triad_2"] = colors[i]
          if (check_next(args)) { break }
        }
        // stop processing c003 locks here
        break
    }
  }
  return {ok:success, msg:ret, args:args}
}
