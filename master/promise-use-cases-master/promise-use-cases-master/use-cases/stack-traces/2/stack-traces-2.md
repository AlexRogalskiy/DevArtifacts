### Use Case #stack-traces-2

Name: Async stack traces cannot be controlled by the user - can't log errors in production

Burton wrote a production Node.js application and is currently debugging code that uses promises in production. 

```js

// model file.
module.exports.someAsyncFn = async function someAsyncFn(ms) {
  await require('util').promisify(setTimeout)(ms);
  b();
};
async function b() {
  await require('util').promisify(setTimeout)(100);
  c();
}
async function c() {
  await require('util').promisify(setTimeout)(100);
  throw new Error(); // in practice - a real error case given input
}

// server file
app.get((req, res) => 
  let result = await someAsyncFn(5); // this throws an exception sometimes
  res.json(result); 
});
```

### What happens

Burton gets a stack trace that breaks on async actions unlike when debugging in development with the inspector

### Why it happens

Because async stack traces are currently not exposed outside of the inspector.

### What can we maybe do better

Node.js could expose async stack traces sometimes somehow to achieve parity with promise libraries which would make users' lives easier. At least - it should be users' call.