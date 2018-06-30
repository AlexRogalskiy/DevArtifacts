###[http://devbootcat.herokuapp.com/](http://devbootcat.herokuapp.com/)
![http://i.imgur.com/hUlyuCa.png](http://i.imgur.com/hUlyuCa.png)
##Wireframes & User Flows
![whiteboard](http://i.imgur.com/f8qjKGG.jpg)
##User Stories, etc.
See our [Trello board](https://trello.com/b/zlkG8OAa/devbootcat)
##Schema (MVP)
![Schema (MVP)](http://cl.ly/image/2Z3h2I3G1s2A/Image%202014-06-04%20at%204.36.23%20PM.png "")

####Questions/Things to look into
*Join table(s)*
- Are they named properly? `first_table + _ + second_table`
  Both table names are plural, alphabetical order, default name can be configured

- Does it have a primary id? It shouldn't. Must suppress it with:
  `create_table :somethings_things, :id => false`

- remove timestamps
- index foreign keys to make lookups faster





