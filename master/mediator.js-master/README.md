Mediator Pattern
================

A JavaScript mediator pattern experiment.

## Features
* pub/sub
* event binding
* universally unique identifier v4 generator

## Examples

```js
mediator.subscribe("myEvent", function () { console.log("myEvent"); });
mediator.publish("myEvent"); // output: myEvent

mediator.subscribe("myUniqueEvent", function () { console.log("myUniqueEvent"); }, "unique");
mediator.subscribe("myUniqueEvent", function () { console.log("myUniqueEventOverwrite"); }, "unique");
mediator.publish("myUniqueEvent"); // output: myUniqueEventOverwrite

mediator.listen({
	"mouseover body" : function () { console.log("mouseover"); },
	"click     body" : function () { console.log("click"); }
});
```