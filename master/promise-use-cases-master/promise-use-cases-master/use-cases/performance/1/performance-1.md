### Use Case #1

Name:  Users are still using libraries for the heaviest promise loads - especially libraries. 

Lana is writing a popular database library for Node.js, Mark is using a userland module (bluebird) instead of built in promises because she believes it provides a better debugging experience for users.

### What happens

Lana is happily using a userland module - but the userland module does not integrate with Node.js async hooks, debugging or instruementation.

### Why it happens

Because Lana believes that libraries have a higher standard of burden when impacting user performance and she would like proof that native promises are better before switching.

### What can we maybe do better

We should provide up-to-date benchmarks that are published with Node.js versions (maybe?) as well as invite users of userland modules for discussion in order to address performance concerns.