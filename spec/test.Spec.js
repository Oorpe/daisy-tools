var chain = require("../src/chain.js").chain;


describe("chain: a simple API for chained user interface queries", ()=>{
  var stdin;
  beforeEach(()=>{
    stdin = require('mock-stdin').stdin();
  })

  afterAll(()=>{
    stdin.end();
  })

  it("should be chainable", (done)=>{

    chain({prompt: "first answer:"})
    .chain({prompt: "second answer:"})
    .then((x)=>{
      expect(x.length).toEqual(2)
      expect(x[0].answer).toEqual("text1")
      expect(x[1].answer).toEqual("text2")
      done();

    })
    //throw the inputs in
    mockInput(stdin, ["text1","text2"], 150);
  })

  it("should allow verification in chains", (done)=>{
    console.log("should allow verification in chains")

    chain({prompt: "first answer:"})
    .restrict(x=>{
        return x != "hoo";
    })
    .restrict(x=>{
        return x != "text2";
    })
    .chain({prompt:"second question?"})

    .then((x)=>{
      expect(x[0].answer).toEqual("text3")
      expect(x[1].answer).toEqual("text4")
      done();
    })
    //throw the inputs in
    mockInput(stdin, ["hoo","text2", "text3", "text4"], 150);
  })

})

/*
  recursion is next to godliness
  mocks every input to stdin from array arr, sends every interval
*/
function mockInput(stdin, arr, interval){
  setTimeout(()=>{
    stdin.send(arr.shift()+"\n")
    mockInput(stdin, arr, interval)
  }, interval)
}
