
const readline = require('readline');

const utils = require("./utils.js");
// module.exports = {
//   attachToPrevious: attachToPrevious,
//   noNegatives: noNegatives,
//   arrOfChecks: arrOfChecks
// }

function chain2(params){
  return new UIChain(params);
}

class UIChain{

  constructor (params){

    this.append= params.append || "\n";
    this.previous= params.previous || [];


    this.rl = readline.createInterface({
      input: process.stdin
      , output: process.stdout
    });

    return this.chain(params);

  }

  /**
    this should be chainable
  */
  prompt(rl, line, append){

    return ()=>{
      return new Promise(d =>{

        rl.question(line + append, (x)=>{
          d({prompt:line, answer:x});
          rl.pause();
        })
      })
    }
  }

  chain(param){
    if(param.append){
      this.append = param.append;
    }
    if(param.prompt){
      this.previous.push({func:this.prompt(this.rl, param.prompt, this.append), restrict: []})
    }
    return this;
  }

  /**
  then wraps the output promise of the chained steps
  */
  then(...args){
    utils.attachToPrevious(this.previous).then(x=>{
      var f = args[0];
      this.rl.close();
      f(x);
    })
  }

  /**
  attach to previously registered thingy a verifier feature
  that has to be passed to go to the next position in the array
  */
  restrict(verifier){

    this.previous[this.previous.length-1].restrict.push(verifier);
    return this;
  }




}
//
// function prompt(rl, line, append){
//
//   return ()=>{
//     return new Promise(d =>{
//
//       rl.question(line + append, (x)=>{
//         d({prompt:line, answer:x});
//         rl.pause();
//       })
//     })
//   }
// }
//
// chain=(param)=>{
//   var _this = this;
//   _this.rl = readline.createInterface({
//     input: process.stdin
//     , output: process.stdout
//     // , terminal: false
//   });
//
//   _this.previous = [];
//   _this.append = "\n";
//
//   /*
//   chain adds a new prompt task to the end of the chain
//   */
//   _this.chain = (param)=>{
//     if(param.append){
//       _this.append = param.append;
//     }
//     if(param.prompt){
//       _this.previous.push({func:prompt(_this.rl, param.prompt, _this.append), restrict: []})
//     }
//     return _this;
//   }
//
//   /**
//   then wraps the output promise of the chained steps
//   */
//   _this.then = (...args)=>{
//     utils.attachToPrevious(_this.previous).then(x=>{
//       var f = args[0];
//       _this.rl.close();
//       f(x);
//     })
//   }
//
//   /**
//   attach to previously registered thingy a verifier feature
//   that has to be passed to go to the next position in the array
//   */
//   _this.restrict = (verifier)=>{
//
//     _this.previous[_this.previous.length-1].restrict.push(verifier);
//     return _this;
//   }
//
//     return _this.chain(param);
//   // }
//   return _this;
// }
//
// chain({prompt:"eka"})
// .chain({prompt:"toka"})
// .then(x=>{
//   console.log(x)
// })

module.exports = {
  chain:chain2
}
