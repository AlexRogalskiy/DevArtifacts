### Use Case #testing-1

Name: Fake timers break with promises because there is no way to "pump" the event loop.

Tana is using Sinon.JS or Jest's fake timer library in order to run tests that take a lot of time due to timers in production synchronously.

This is a common complaint I get as one of several maintainers of lolex.

### What happens

Currently, there is no way for testing and mocking libraries to force async functions to `flush` the microtick queues. This is not a problem with `nextTick` or promises in general - but with `async` functions in Node.js.

```js
async function foo() {
  await promisifiedTimeout(100);
  return 15;
}
// no way to run the above code synchronously, although the timers can be 'soundly' run.
```
### Why it happens

Because of language semantics - this is a "good thing" (tm) similarly to timers in general.

### What can we maybe do better

We should provide an escape hatch for mocking and instrumentation so users won't have to transpile their code to userland modules in order to test it. Currently users transpile to bluebird and `setScheduler`. 