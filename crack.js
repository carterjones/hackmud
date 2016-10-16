function (context, a){
  // TODO: add ability to grab next target from the database
  var ez=["open","release","unlock"],
      //primes=[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 1103, 1109, 1117, 1123, 1129],
      primes=[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]
      colors=["red","orange","yellow","green","lime","blue","cyan","purple"],
      ret, args = {}, success=false,
      unlocked = /(LOCK_UNLOCKED)\s(ez_[0-9]{2}|c00[1-3])/g,
      locked = /LOCK_ERROR/g,
      locks = /(EZ_[0-9]{2}|c00[1-3])/g,
      lock_list = [],
      i, lock // these are used later
  function check_next(args, next){
    ret = a.target.call(args)
    if (ret.includes("is missing") || ret.includes("unlocked")) {
      return true
    }
  }
  while (!success) {
    ret = a.target.call({})
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
        for(i=0; i<3; i++){
          args[lock] = ez[i]
          if (check_next(args)){break}
        }
        // Stop processing ez_21 locks here
        if (lock == "ez_21") { break }
        else if (lock == "ez_35") {
          // Process the rest of ez_35 locks.
          for(i=0; i<10; i++){
            args.digit = i
            if (check_next(args)){break}
          }
        }
        else if (lock == "ez_40") {
          // Process the rest of ez_40 locks.
          for(i=0; i<primes.length; i++){
            args.ez_prime = primes[i]
            if (check_next(args)){break}
          }
        }
        // Stop processing ez_35 or ez_40 locks.
        break
      case "c001":
      case "c002":
      case "c003":
        // Identify the base lock value.
        for(i=0; i<8; i++){
          args[lock] = colors[i]
          if (check_next(args)){break}
        }
        // Stop processing c001 locks here
        if (lock == "c001") { break }
        // Set the first triad value.
        for (i=0; i<8; i++){
          args["c003_triad_1"] = colors[i]
          if (check_next(args)){break}
        }
        // Stop processing c002 locks here
        if (lock == "c002") { break }
        // Set the second triad value.
        for (i=0; i<8; i++){
          args["c003_triad_2"] = colors[i]
          if (check_next(args)){break}
        }
        // stop processing c003 locks here
        break
    }
  }
  // TODO: if successful, remove the entry from the database.
  // TODO: if unsuccessful, process error and remove from database if it is breached; otherwise return the error.
  return {ok:success, msg:ret, args:args}
}
