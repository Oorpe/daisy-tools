# utencils

helper stuff for UI building

## chain

### API

The chain module's api is as follows:

```javascript
  chain({
    prompt: "this is for asking a question on the stdio"
  })
  .verify(x=>{
    return x != "kelpaamaton arvo"
  })
  .then(res=>{
    console.log("the array containing all user answers is: ", res)
    // => "[{prompt:  'this is for asking a question on the stdio', answer: 'kissa'}]"
  })
```

#### chain

chain is the visible starter function that instantiates a chain. It returns an instance of the chain class with methods chain, verify, then, run etc. this allows skipping the whole
```javascript
  var thing = chain-class();
  thing.chain(...)
```
-thing, and allows for terse and readable code.

chain-methods take in a regular options object.
```javascript
  chain({
    prompt:"a cli prompt to be answered",
    linebreak: boolean, //default true
  })
```

verify-methods take a function to be applied over the previous link in the chain, so that if the function returns falsy, the progression stops and the previous question is re-asked.

verifyAll adds a verifier function to all the previous links instead of just the very last.
