### Use Case #2

Name: Async iterators don't have a great performance story yet which might hinder further adoption - although it appears that not that many people are using them so it's hard to draw conclusions.

Jessie is writing code with async iterators and is complaining about the performacne.

### What happens

Jessie is using the fact async iterators work with streams in Node.js for using `for...await` in their code but had to switch back due to poor performance

### Why it happens

Because async iterators are slow in some use cases and benchmarks - especially compared to push streams.

### What can we maybe do better

Honestly we have no idea how many users are using async iterators - we have a pending work item on gathering user feedback in the ReadableStream repo.

I don't think (personally) that we should address this.