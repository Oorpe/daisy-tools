
const readline = require('readline');

/**
  run an array of checkers over a value primitive, return the results as a boolean array
*/
arrOfChecks=(value, checks)=>{
  var res = [];
  checks.forEach(x=>{
    res.push(x(value));
  })
  return res;
}

noNegatives=(value, checks)=>{
  return arrOfChecks(value, checks).indexOf(false) === -1;
}

/**
  given an array of functions returning Promises, this chains the
  promises such that they are requested sequentially, and it returns a promise
  that resolves with an array that contains all the results of the promises.
*/
function attachToPrevious(arr, prevResults=[]){
  if(arr && arr.length && arr.length != 0){
    // console.log(arr)
    var p = arr.shift();
    return p.func.call().then(x=>{
      // console.log("result:",x, "p:",p)
      //if restricts registered
      if(p.restrict.length > 0){
        // console.log(, "\n")
        //verification failed
        if(noNegatives(x.answer, p.restrict)){
            prevResults.push(x)
        }else{
            arr.unshift(p);
        }
        // console.log(p.verifier.failed)
      }else{
        prevResults.push(x)
      }
      // console.log("x:",x)

      return attachToPrevious(arr, prevResults)
    })
  }else{
    return new Promise(r=>{r(prevResults)})
  }
}



/**
  this should be chainable
*/
function prompt(rl, line, append){

  return ()=>{
    return new Promise(d =>{

      rl.question(line + append, (x)=>{
        d({prompt:line, answer:x});
        rl.pause();
      })
    })
  }
}

chain=(param)=>{
  var _this = this;
  _this.rl = readline.createInterface({
    input: process.stdin
    , output: process.stdout
    // , terminal: false
  });

  _this.previous = [];
  _this.append = "\n";

  /*
  chain adds a new prompt task to the end of the chain
  */
  _this.chain = (param)=>{
    if(param.append){
      _this.append = param.append;
    }
    if(param.prompt){
      _this.previous.push({func:prompt(_this.rl, param.prompt, _this.append), restrict: []})
    }
    return _this;
  }

  /**
  then wraps the output promise of the chained steps
  */
  _this.then = (...args)=>{
    attachToPrevious(_this.previous).then(x=>{
      var f = args[0];
      _this.rl.close();
      f(x);
    })
  }

  /**
  attach to previously registered thingy a verifier feature
  that has to be passed to go to the next position in the array
  */
  _this.restrict = (verifier)=>{

    _this.previous[_this.previous.length-1].restrict.push(verifier);
    return _this;
  }

  // if(_this.previous && _this.previous.length != 0){
    //we should never get here
    // console.log("what?");
  // }else{
    //if no previous chain, this is first in chain.
    return _this.chain(param);
  // }
  return _this;
}

chain({prompt:"eka"})
.chain({prompt:"toka"})
.then(x=>{
  console.log(x)
})

module.exports = {
  chain:chain
}
