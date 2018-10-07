### Use case #3

Name: Users have asked for a way to "unsubscribe" promise listeners ("unthen") - Kyle Simpson opened an issue about this

Peter is writing code with promises and is surprised by the fact he cannot unsubscribe from a promise once he has subscribed for it.

### What happens ?

It is impossible to unsubscribe from promises at the moment and it is impossible to write code that does this with a promise subclass that operates correctly.

### Why it happens ?

Language semantics

### What can we maybe do better

Provide a hook (experimental?) that lets people write a userland module that enables them to do this.