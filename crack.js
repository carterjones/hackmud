function (context, a){
  var ez=["open","release","unlock"],
      primes=[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97],
      colors=["red","orange","yellow","green","lime","blue","cyan","purple"],
      ret, args = {}, success=false,
      unlocked = /(LOCK_UNLOCKED)\s(ez_[0-9]{2}|c00[1-3])/g,
      locked = /LOCK_ERROR/g,
      locks = /(EZ_[0-9]{2}|c00[1-3])/g,
      lock_list = [],
      i, j, k, lock, // these are used later
      out = ""
  function unlocked_true(args, lock){
    ret = a.target.call(args);
    out += ret
    if (unlocked.exec(ret)[1] === lock) {
      return true;
    }
  }
  while (!success) {
    ret = a.target.call({});
    if (!locked.test(ret)) {
      success = true;
      break;
    }
    while (lock = locks.exec(ret)) {
      lock_list.push(lock[1])
    }
    lock = lock_list[lock_list.length - 1].toLowerCase();
    switch (lock) {
      case "ez_21":
        for(i=0; i<3; i++){
          args[lock] = ez[i];
          if (unlocked_true(args, lock)){break;}
          return out
        }
      case "ez_35":
        for(i=0; i<3; i++){
          for (j=0; j<10; j++) {
            args[lock] = ez[i];
            args.digit = j;
            if (unlocked_true(args, lock)){break;}
          }
        }
      case "ez_40":
        for(i=0; i<3; i++){
          for (j=0; j<10; j++) {
            for (k = 0; k < primes.length; k++) {
              args[lock] = ez[i];
              args.ez_prime = primes[k];
              if (unlocked_true(args, lock)){break;}
            }
          }
        }
      case "c001":
        break;
      case "c002":
        break;
      case "c003":
        break;
    }
  }
  //return {ok:success, msg:ret}
  return out
}
