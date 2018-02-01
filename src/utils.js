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
      //recurse until ready
      return attachToPrevious(arr, prevResults)
    })
  }else{
    return new Promise(r=>{r(prevResults)})
  }
}





module.exports = {
  attachToPrevious: attachToPrevious,
  noNegatives: noNegatives,
  arrOfChecks: arrOfChecks
}
